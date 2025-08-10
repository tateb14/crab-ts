const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
module.exports = {
  customIdPrefix: 'crab-button_shift-add-time',
  execute: async (interaction) => {
    const shiftId = interaction.customId.split(":")[1]
    const modal = new ModalBuilder()
    .setCustomId(`crab-modal_shift-add:${shiftId}`)
    .setTitle("Add Time")
    const AddInput = new TextInputBuilder()
    .setCustomId("crab-input_add-time")
    .setLabel("How long do you want to add to the shift?")
    .setPlaceholder("Please use commands like: 1s, 1m, 1h, 1d")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    const row = new ActionRowBuilder().addComponents(AddInput)
    modal.addComponents(row)
    await interaction.showModal(modal)
  }
}
