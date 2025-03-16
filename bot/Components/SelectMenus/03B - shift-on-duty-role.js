const { MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')

module.exports = {
  customId: 'crab-sm_on-duty-role',
  execute: async (interaction) => {
    const selectedRole = interaction.values[0]
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: {shift_OnDuty: selectedRole } },
      { upsert: true, new: true }
    )
    await interaction.update({})
    await interaction.followUp({ content: `You have selected <@&${selectedRole}> as the on duty role.`, flags: MessageFlags.Ephemeral })
  }
}
