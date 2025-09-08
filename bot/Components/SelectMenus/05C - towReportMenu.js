const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
  customId: 'crab_tow-report',
  execute: async (interaction) => {
    const modal = new ModalBuilder()
    .setTitle("Tow Report")
    .setCustomId("crab-modal_tow-report")

    const Description = new TextInputBuilder()
      .setLabel("Describe the whole tow operation.")
      .setCustomId("crab-input_description")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMinLength(100)
      .setMaxLength(1020)
    const row = new ActionRowBuilder().addComponents(Description)
    modal.addComponents(row)

    await interaction.showModal(modal)
  }
}

