const { MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
module.exports = {
  customId: 'crab-sm_shift-types',
  execute: async (interaction) => {
    const types = interaction.values
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { shift_Types: types } },
      { upsert: true, new: true }
    )
    await interaction.update({})
    await interaction.followUp({ content: `Successfully saved the shift types.`, flags: MessageFlags.Ephemeral })
  }
}
