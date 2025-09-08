const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
  customId: 'crab_medical-report',
  execute: async (interaction) => {
    const modal = new ModalBuilder()
    .setTitle("Medical Report")
    .setCustomId("crab-modal_medical-report")

    const Description = new TextInputBuilder()
      .setLabel("Describe the whole medical incident.")
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

