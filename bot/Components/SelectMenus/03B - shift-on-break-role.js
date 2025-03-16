const { MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')

module.exports = {
  customId: 'crab-sm_on-break-role',
  execute: async (interaction) => {
    const selectedRole = interaction.values[0]
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: {shift_OnBreak: selectedRole } },
      { upsert: true, new: true }
    )
    await interaction.update({})
    await interaction.followUp({ content: `You have selected <@&${selectedRole}> as the on break role.`, flags: MessageFlags.Ephemeral })
  }
}
