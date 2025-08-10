const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
module.exports = {
  customIdPrefix: 'crab-button_shift-subtract-time',
  execute: async (interaction, client) => {
    const shiftId = interaction.customId.split(":")[1]
    const modal = new ModalBuilder()
    .setCustomId(`crab-modal_shift-subtract:${shiftId}`)
    .setTitle("Subtract Time")
    const SubtractInput = new TextInputBuilder()
    .setCustomId("crab-input_subtract-time")
    .setLabel("How much should be subtracted?")
    .setPlaceholder("Please use commands like: 1s, 1m, 1h, 1d")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    const row = new ActionRowBuilder().addComponents(SubtractInput)
    modal.addComponents(row)
    await interaction.showModal(modal)
  }
}
