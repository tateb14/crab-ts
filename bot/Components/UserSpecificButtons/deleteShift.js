const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js')
const ShiftLog = require('../../schemas/ShiftLog')
module.exports = {
  customIdPrefix: 'crab-button_shift-delete',
  execute: async (interaction, client) => {
    const shiftId = interaction.customId.split(":")[1]
    const DeleteButton = new ButtonBuilder()
    .setCustomId(`crab-button_shift-delete-confirm:${shiftId}`)
    .setLabel("Confirm")
    .setStyle(ButtonStyle.Success)
    const CancelButton = new ButtonBuilder()
    .setCustomId(`crab-button_cancel`)
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder().addComponents(DeleteButton, CancelButton)
    interaction.reply({ content: "Are you sure you want to delete this shift?", components: [row], flags: MessageFlags.Ephemeral })
  }
}
