const { EmbedBuilder, inlineCode, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
const GuildReport = require('../../schemas/GuildReport')
module.exports = {
  customId: 'crab-button_review-report',
  execute: async (interaction, client) => {
    const GuildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id }) 
    const SupervisorRole = GuildConfig.perms_SupervisorRole
    const HiCommRole = GuildConfig.perms_HiCommRole
    const AARole = GuildConfig.perms_AllAccessRole

    if (interaction.member.roles.cache.has(SupervisorRole || HiCommRole || AARole)) {
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
      ReviewedEmbed.setColor(0x2A9D8F)
      interaction.update({ content: `This record has been reviewed by ${interaction.user}`, embeds: [ReviewedEmbed], components: [newRow] })
      if (user) {
        try {
          await user.send(`**Report ID:** ${inlineCode(Report.id)} has been reviewed by ${interaction.user}`);
        } catch (err) {
          console.log(`Could not send DM to user ${user.id}:`, err.message);
        }
      }
    } else {
      interaction.reply({ content: "**Insufficient** permissions.", flags: MessageFlags.Ephemeral })
    }
  }
}
