import { ModalSubmitInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, AttachmentBuilder, TextChannel } from "discord.js";
import crabConfig from "../../Models/crab-config";
import guildReport from "../../Models/guild-report";
import { emojis } from '../../config';
import { generateDatabaseIdString } from "../../Functions/randomId";
export default {
    customId: "crab-modal_accident-report",
    execute: async (interaction: ModalSubmitInteraction) => {
        const guildConfig = await crabConfig.findOne({ guildId: interaction.guild!.id });
        if (!guildConfig) return;
        const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
            name: "embed-footer-banner.png",
        });

        const reportID = `report_${generateDatabaseIdString()}`;
        const accidentDescription = interaction.fields.getTextInputValue("crab-input_description");
        const supervisorRole = guildConfig!.perms_SupervisorRole;
        const embed = new EmbedBuilder()
            .setAuthor({ name: `@${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setColor(0xec3935)
            .setFooter({ text: `Report ID: ${reportID} || Powered by Crab` })
            .setDescription(`Below are details of the accident report submitted by ${interaction.user}.`)
            .setImage("attachment://embed-footer-banner.png")
            .setTitle("Accident Report")
            .addFields({
                name: "Accident Description",
                value: `${accidentDescription}`,
            });
        const reviewButton = new ButtonBuilder().setCustomId("crab-button_review-report").setLabel("Mark as Reviewed").setStyle(ButtonStyle.Success).setEmoji(emojis.check);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(reviewButton);
        const channel = await interaction.guild!.channels.fetch(guildConfig!.report_Logs) as TextChannel
        if (channel) {
            const reportMessage = await channel.send({ content: `<@&${supervisorRole}>, a new report has been submitted by ${interaction.user}. Please review it and click the button.`, embeds: [embed], components: [row], files: [embedFooter] });
            interaction.reply({ content: "Your report has been submitted and you will be messaged when it is reviewed.", flags: MessageFlags.Ephemeral });
            const newReport = new guildReport({
                IssuedBy: interaction.user.id,
                ReviewedBy: null,
                Description: accidentDescription,
                ReportType: "Accident Report",
                id: reportID,
                guildId: interaction.guild!.id,
                messageId: reportMessage.id,
            });
            await newReport.save();
        } else {
            interaction.reply({ content: "An error has occured, no report logging channel could be found. Please report this to your server administrator.", flags: MessageFlags.Ephemeral });
        }
    },
};
