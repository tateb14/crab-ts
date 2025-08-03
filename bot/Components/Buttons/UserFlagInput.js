const { EmbedBuilder, inlineCode, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {
  customId: 'crab-flag_user',
  execute: async (interaction, client) => {
    const Modal = new ModalBuilder()
    .setCustomId("crab-modal_user-flag-input")
    .setTitle("User Flag Input")
    const UserIDInput = new TextInputBuilder()
    .setCustomId("crab-flag_user-id")
    .setLabel("User ID:")
    .setPlaceholder("e.g. 1265984568746573846")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    const row1 = new ActionRowBuilder().addComponents(UserIDInput)
    Modal.addComponents(row1, row2, row3)
    interaction.showModal(Modal)
  }
}
