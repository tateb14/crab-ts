const { EmbedBuilder, inlineCode, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
const GuildReport = require('../../schemas/GuildReport')
module.exports = {
  customId: 'crab-button_review-report',
  execute: async (interaction, client) => {
    const GuildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id }) 
    const SupervisorRole = GuildConfig.perms_SupervisorRole
    const HiCommRole = GuildConfig.perms_HiCommRole
    const AARole = GuildConfig.perms_AllAccessRole

    if (interaction.member.roles.cache.has(SupervisorRole) || interaction.member.roles.cache.has(HiCommRole) || interaction.member.roles.cache.has(AARole)) {
      console.log()
      const Report = await GuildReport.findOne(
      { messageId: interaction.message.id },
    )
      const embed = interaction.message.embeds[0]
      const user = await interaction.guild.members.fetch(Report.IssuedBy);
      const ReviewedEmbed = EmbedBuilder.from(embed)
      const Buttons = interaction.message.components
      const row = ActionRowBuilder.from(Buttons[0])
      const startButton = row.components[0]
      startButton.setDisabled(true)
      startButton.setLabel(`Reviewed by @${interaction.user.username}`)
      const newRow = new ActionRowBuilder().addComponents(startButton)
      ReviewedEmbed.setColor(0x39ec35)
      const serverButton = new ButtonBuilder()
        .setCustomId("crab-button_server-name-disabled")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Sent from ${interaction.guild.name}`)
      const ServerRow = new ActionRowBuilder().addComponents(serverButton)
      interaction.update({ content: `This record has been reviewed by ${interaction.user}`, embeds: [ReviewedEmbed], components: [newRow] })
      if (user) {
        try {
          await user.send({ content: `**Report ID:** ${inlineCode(Report.id)} has been reviewed by ${interaction.user}`, components: [ServerRow] });
        } catch (err) {
          return interaction.followUp({ content: "I could not DM this user.", flags: MessageFlags.Ephemeral })
        }
      }
    } else {
      interaction.reply({ content: "**Insufficient** permissions.", flags: MessageFlags.Ephemeral })
    }
  }
}
