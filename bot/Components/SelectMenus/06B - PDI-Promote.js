const { MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
module.exports = {
  customId: 'crab-sm_promote-log',
  execute: async (interaction) => {
    const selectedChannel = interaction.values[0]
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { promote_Logs: selectedChannel } },
      { upsert: true, new: true }
    )
    await interaction.update({})
    await interaction.followUp({ content: `You have selected <#${selectedChannel}> as the log channel for promotions.`, flags: MessageFlags.Ephemeral })
  }
}
