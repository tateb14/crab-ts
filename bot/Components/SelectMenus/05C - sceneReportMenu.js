const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
  customId: 'crab_scene-report',
  execute: async (interaction) => {
    const modal = new ModalBuilder()
    .setTitle("Scene Report")
    .setCustomId("crab-modal_scene-report")

    const Description = new TextInputBuilder()
      .setLabel("Describe the whole scene.")
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

