
import { MessageFlags, StringSelectMenuInteraction } from 'discord.js'
import crabConfig from '../../../Models/crab-config'

export default {
  customId: 'crab-sm_shift-types',
  execute: async (interaction: StringSelectMenuInteraction) => {
    const types = interaction.values
    await crabConfig.findOneAndUpdate(
      { guildId: interaction.guild!.id },
      { $set: { shift_Types: types } },
      { upsert: true, new: true }
    )
    await interaction.update({})
    await interaction.followUp({ content: `Successfully saved the shift types.`, flags: MessageFlags.Ephemeral })
  }
}
