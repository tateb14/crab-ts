const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js')
const ShiftLog = require('../../schemas/ShiftLog')
const responses = require('../../Functions/responses')
module.exports = {
  customIdPrefix: 'crab-button_shift-delete',
  execute: async (interaction, client) => {
    const [_, shiftId, messageId, AuthorizedUser] = interaction.customId.split(":")
    if (interaction.user.id !== AuthorizedUser) {
      return interaction.reply(responses.errors.unauthorizedUser)
    }
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
