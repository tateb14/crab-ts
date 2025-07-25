const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
  customId: 'crab_incident-report',
  execute: async (interaction) => {
    const modal = new ModalBuilder()
    .setTitle("Incident Report")
    .setCustomId("crab-modal_incident-report")

    const Description = new TextInputBuilder()
      .setLabel("Describe the whole incident.")
      .setCustomId("crab-input_description")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMinLength(100)
    const row = new ActionRowBuilder().addComponents(Description)
    modal.addComponents(row)

    await interaction.showModal(modal)
  }
}

