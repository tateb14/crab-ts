const { MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
module.exports = {
  customId: 'crab-sm_reports-log',
  execute: async (interaction) => {
    const selectedChannel = interaction.values[0]
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { report_Logs: selectedChannel } },
      { upsert: true, new: true }
    )
    await interaction.update({})
    await interaction.followUp({ content: `You have selected <#${selectedChannel}> as the log channel for reports.`, flags: MessageFlags.Ephemeral })
  }
}
