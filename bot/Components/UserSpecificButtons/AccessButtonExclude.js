const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
module.exports = {
  customIdPrefix: 'crab-exclude_access-code',
  execute: async (interaction, client) => {
    const userId = interaction.customId.split(":")[1]
    if (interaction.user.id === userId) {
      const Modal = new ModalBuilder()
      .setCustomId("crab-modal_access-code-form")
      .setTitle("Enter Access Code")
      const AccessCodeForm = new TextInputBuilder()
      .setCustomId("crab_access-code-input")
      .setLabel("Access Code:")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      const row = new ActionRowBuilder().addComponents(AccessCodeForm);
      Modal.addComponents(row)
      interaction.showModal(Modal)
    }
  }
}
