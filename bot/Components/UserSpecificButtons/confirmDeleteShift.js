const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const ShiftLog = require('../../schemas/ShiftLog')
module.exports = {
  customIdPrefix: 'crab-button_shift-delete-confirm',
  execute: async (interaction, client) => {
    const shiftId = interaction.customId.split(":")[1]
    await ShiftLog.findOneAndDelete({ guildId: interaction.guild.id, shift_id: shiftId })

    interaction.update({ content: "Action **complete**, the shift has been removed.", components: [] })
    setTimeout(async () => {
      try {
          await interaction.deleteReply();
      } catch (error) {
          console.error('Failed to delete interaction reply:', error);
      }
  }, 10000);
  }
}
