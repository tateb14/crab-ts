import { MessageFlags, ChannelSelectMenuInteraction } from 'discord.js'
import crabConfig from '../../../Models/crab-config'

export default {
  customId: 'crab-sm_demote-log',
  execute: async (interaction: ChannelSelectMenuInteraction) => {
    const selectedChannel = interaction.values[0]
    await crabConfig.findOneAndUpdate(
      { guildId: interaction.guild!.id },
      { $set: { demote_Logs: selectedChannel } },
      { upsert: true, new: true }
    )
    await interaction.update({})
    await interaction.followUp({ content: `You have selected <#${selectedChannel}> as the log channel for demotions.`, flags: MessageFlags.Ephemeral })
  }
}
