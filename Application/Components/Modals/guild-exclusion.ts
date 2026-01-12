import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ModalSubmitInteraction, TextChannel, AttachmentBuilder } from "discord.js";
import guildExclusion from "../../Models/guild-exclusion";
import * as emojis from "../../../emojis.json";
export default {
    customId: "crab-modal_guild-exclude",
    execute: async (interaction: ModalSubmitInteraction) => {
        if (!interaction.guild) return;
        const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
            name: "embed-footer-banner.png",
        });

        const guildId = interaction.fields.getTextInputValue("crab-exclude_guild-id");
        const reason = interaction.fields.getTextInputValue("crab-exclude_reason");
        const proof = interaction.fields.getTextInputValue("crab-exclude_proof");
        const issuer = interaction.user;
        const embed = new EmbedBuilder()
            .setTitle(`Guild Exclusion created by @${issuer.username}`)
            .setImage("attachment://embed-footer-banner.png")
            .addFields(
                {
                    name: "Excluding (Guild ID):",
                    value: `${guildId}`,
                },
                {
                    name: "Reason:",
                    value: `${reason}`,
                }
            );

        const ProofButton = new ButtonBuilder().setLabel("Proof for Exclusion").setURL(proof).setStyle(ButtonStyle.Link);

        const serverButton = new ButtonBuilder().setCustomId("crab-button_server-name-disabled").setDisabled(true).setStyle(ButtonStyle.Secondary).setLabel(`Official Notice from Tropical Systems`);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(ProofButton);
        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(serverButton);
        const exclusionChannel = (await interaction.guild.channels.fetch("1398166536971091978")) as TextChannel;
        if (!exclusionChannel) {
            return interaction.reply({ content: `${emojis.x} **@${interaction.user.username}**, the exclusion channel has not been located.` });
        }
        const newExclusion = new guildExclusion({
            crab_guildId: guildId,
            issuedBy: issuer.id,
            crab_Reason: reason,
            crab_Proof: proof,
        });
        await newExclusion.save();
        interaction.reply({ content: "Exclusion created and complete.", flags: MessageFlags.Ephemeral });
        await exclusionChannel.send({ embeds: [embed], components: [row, row2], files: [embedFooter] });
    },
};
