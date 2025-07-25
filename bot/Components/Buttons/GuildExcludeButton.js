const { EmbedBuilder, inlineCode, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {
  customId: 'crab-exclude_guild',
  execute: async (interaction, client) => {
    const Modal = new ModalBuilder()
    .setCustomId("crab-modal_guild-exclude")
    .setTitle("Guild Exclusion Form")
    const GuildIDInput = new TextInputBuilder()
    .setCustomId("crab-exclude_guild-id")
    .setLabel("Guild ID:")
    .setPlaceholder("e.g. 1348623820331679744")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    const ReasonInput = new TextInputBuilder()
    .setCustomId("crab-exclude_reason")
    .setRequired(true)
    .setLabel("Reason of Exclusion:")
    .setStyle(TextInputStyle.Paragraph)
    const ProofLinkInput = new TextInputBuilder()
    .setCustomId("crab-exclude_proof")
    .setRequired(true)
    .setLabel("Link 1 Proof File")
    .setStyle(TextInputStyle.Paragraph)

    const row1 = new ActionRowBuilder().addComponents(GuildIDInput)
    const row2 = new ActionRowBuilder().addComponents(ReasonInput)
    const row3 = new ActionRowBuilder().addComponents(ProofLinkInput)
    Modal.addComponents(row1, row2, row3)
    interaction.showModal(Modal)
  }
}
