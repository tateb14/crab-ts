const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, inlineCode } = require('discord.js')
module.exports = {
  customIdPrefix: 'crab-modal_report-beta',
  execute: async (interaction, client) => {
    const type = interaction.customId.split(":")[1]
    interaction.deferReply({ content: `Creating your ${type} report.`, flags: MessageFlags.Ephemeral })
    const description = interaction.fields.getTextInputValue("crab-input_beta-report-description")
    const invite = await interaction.channel.createInvite({
      maxAge: 0, 
      maxUses: 0, 
      unique: true, 
      reason: 'Requested by user'
  });
    const embed = new EmbedBuilder()
    .setAuthor({ name: `Report submitted by @${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
    .setColor(0xFAF3E0)
    .setDescription(`A new **${type}** has been submitted by **${interaction.user}** // ${inlineCode(interaction.user.id)} from **[${interaction.guild.name}](${invite.url})** // ${inlineCode(interaction.guild.id)}.`)
    .setFooter({ text: `Crab ${type} Report` })
    .addFields(
      {
        name: `${type} Description:`,
        value: `${description}`
      }
    )
  .setTitle(`${type} Report`)
  .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
  .setTimestamp()

  const SupportServer = await client.guilds.fetch("1348623820331679744")
  const channel = await SupportServer.channels.fetch("1409507293673951373")

  await channel.send({ embeds: [embed] })
  interaction.editReply("Your report has been sent!")
  }
}
