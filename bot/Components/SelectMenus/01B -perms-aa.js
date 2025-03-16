const { EmbedBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder, ActionRowBuilder, MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')

module.exports = {
  customId: 'crab-sm_perms-aa',
  execute: async (interaction) => {
    const selectedRole = interaction.values[0]
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { perms_AllAccessRole: selectedRole } },
      { upsert: true, new: true }
    )
    await interaction.update({})
    await interaction.followUp({ content: `You have selected <@&${selectedRole}> as the all access role.`, flags: MessageFlags.Ephemeral })
  }
}
