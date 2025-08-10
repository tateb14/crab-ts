const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js")
const CrabConfig = require("../../schemas/CrabConfig")
const GuildReport = require("../../schemas/GuildReport")
module.exports = {
  customId: "crab-modal_fire-report",
  execute: async (interaction) => {
    const GuildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id })
    function randomString(length, chars) {
      var result = "";
      for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    }
    const ReportID = `report_${randomString(
      24,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )}`;
    const fireDescription = interaction.fields.getTextInputValue("crab-input_description")
    const SupervisorRole = GuildConfig.perms_SupervisorRole
    const embed = new EmbedBuilder()
    .setAuthor({ name: `@${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
    .setColor(0xfaf3e0)
    .setFooter({ text: `Report ID: ${ReportID} || Powered by Crab` })
    .setDescription(`Below are details of the fire report submitted by ${interaction.user}.`)
    .setTitle("Fire Report")
    .addFields(
      {
        name: "Fire Description",
        value: `${fireDescription}`
      },
    )
    const ReviewButton = new ButtonBuilder()
    .setCustomId("crab-button_review-report")
    .setLabel("Mark as Reviewed")
    .setStyle(ButtonStyle.Success)
    .setEmoji('<:crab_check:1396636457690726410>')

    const row = new ActionRowBuilder().addComponents(ReviewButton)
    const channel = await interaction.guild.channels.fetch(GuildConfig.records_Logs)
    if (channel) {
      const ReportMessage = await channel.send({ content: `<@&${SupervisorRole}>, a new report has been submitted by ${interaction.user}. Please review it and click the button.`, embeds: [embed], components: [row] })
      interaction.reply({ content: "Your report has been submitted and you will be messaged when it is reviewed.", flags: MessageFlags.Ephemeral })
      const newReport = new GuildReport({
        IssuedBy: interaction.user.id,
        ReviewedBy: null,
        Description: fireDescription,
        ReportType: "Fire Report",
        id: ReportID,
        guildId: interaction.guild.id,
        messageId: ReportMessage.id
      })
      await newReport.save()
    } else {
      interaction.reply({ content: "An error has occured, no report logging channel could be found. Please report this to your server administrator.", flags: MessageFlags.Ephemeral })
    }
  }
}
