const { MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
module.exports = {
  customId: 'crab-sm_prefix',
  execute: async (interaction) => {
    const PrefixModal = new ModalBuilder()
    .setCustomId("crab-modal_prefix")
    .setTitle("Configure Crab's Prefix")
    
    const PrefixInput = new TextInputBuilder()
    .setCustomId("crab-text_prefix")
    .setLabel("Type your prefix below.")
    .setPlaceholder(`E.g. -`)
    .setRequired(true)
    .setMinLength(1)
    .setStyle(TextInputStyle.Short)
    const row = new ActionRowBuilder().addComponents(PrefixInput)
    PrefixModal.addComponents(row)
    await interaction.showModal(PrefixModal)
  }
}
