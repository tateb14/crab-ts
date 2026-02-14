import { EmbedBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder, ActionRowBuilder, MessageFlags, RoleSelectMenuInteraction } from 'discord.js'
import crabConfig from '../../../Models/crab-config'

export default {
  customId: 'crab-sm_perms-aa',
  execute: async (interaction: RoleSelectMenuInteraction) => {
    const selectedRole = interaction.values[0]
    await crabConfig.findOneAndUpdate(
      { guildId: interaction.guild!.id },
      { $set: { perms_AllAccessRole: selectedRole } },
      { upsert: true, new: true }
    )

    await interaction.update({})
    await interaction.followUp({ content: `You have selected <@&${selectedRole}> as the all access role.`, flags: MessageFlags.Ephemeral })
  }
}
