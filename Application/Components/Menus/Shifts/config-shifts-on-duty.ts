import { MessageFlags, RoleSelectMenuInteraction } from 'discord.js'
import crabConfig from '../../../Models/crab-config'

export default {
  customId: 'crab-sm_on-duty-role',
  execute: async (interaction: RoleSelectMenuInteraction) => {
    const selectedRole = interaction.values[0]
    await crabConfig.findOneAndUpdate(
      { guildId: interaction.guild!.id },
      { $set: { shift_OnDuty: selectedRole } },
      { upsert: true, new: true }
    )
    await interaction.update({})
    await interaction.followUp({ content: `You have selected <@&${selectedRole}> as the on duty role.`, flags: MessageFlags.Ephemeral })
  }
}
