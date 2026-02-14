import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ModalSubmitInteraction, TextChannel } from "discord.js"
import crabConfig from "../../Models/crab-config"
import guildReport from "../../Models/guild-report"
import { emojis } from '../../config'
import { generateDatabaseIdString } from "../../Functions/randomId"

export default {
  customId: "crab-modal_repair-report",
  execute: async (interaction: ModalSubmitInteraction) => {
    const guild = interaction.guild

    if (!guild) return;

    const guildConfig = await crabConfig.findOne({ guildId: guild.id })
    if (!guildConfig) {
        return;
    }

    const reportId = `report_${generateDatabaseIdString()}`;
    const repairDescription = interaction.fields.getTextInputValue("crab-input_description")
    const supervisorRole = guildConfig.perms_SupervisorRole
    const embed = new EmbedBuilder()
    .setAuthor({ name: `@${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
    .setColor(0xec3935)
    .setFooter({ text: `Report ID: ${reportId} || Powered by Crab` })
    .setDescription(`Below are details of the repair report submitted by ${interaction.user}.`)
    .setTitle("Repair Report")
    .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
    .addFields(
      {
        name: "Repair Description",
        value: `${repairDescription}`
      },
    )
    const reviewButton = new ButtonBuilder()
    .setCustomId("crab-button_review-report")
    .setLabel("Mark as Reviewed")
    .setStyle(ButtonStyle.Success)
    .setEmoji(emojis.check)

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(reviewButton)
    const channel = await interaction.guild.channels.fetch(guildConfig.report_Logs) as TextChannel
    if (channel) {
      const reportMessage = await channel.send({ content: `<@&${supervisorRole}>, a new report has been submitted by ${interaction.user}. Please review it and click the button.`, embeds: [embed], components: [row] })
      interaction.reply({ content: "Your report has been submitted and you will be messaged when it is reviewed.", flags: MessageFlags.Ephemeral })
      const newReport = new guildReport({
        IssuedBy: interaction.user.id,
        ReviewedBy: null,
        Description: repairDescription,
        ReportType: "Repair Report",
        id: reportId,
        guildId: interaction.guild.id,
        messageId: reportMessage.id
      })
      await newReport.save()
    } else {
      interaction.reply({ content: "An error has occured, no report logging channel could be found. Please report this to your server administrator.", flags: MessageFlags.Ephemeral })
    }
  }
}
