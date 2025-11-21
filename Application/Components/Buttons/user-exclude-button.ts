import { ActionRowBuilder, ButtonInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

module.exports = {
  customId: 'crab-exclude_user',
  execute: async (interaction: ButtonInteraction, client: Client) => {
    const modal = new ModalBuilder()
    .setCustomId("crab-modal_user-exclude")
    .setTitle("User Exclusion Form")
    const userIdInput = new TextInputBuilder()
    .setCustomId("crab-exclude_user-id")
    .setLabel("User ID:")
    .setPlaceholder("e.g. 1265984568746573846")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    const reasonInput = new TextInputBuilder()
    .setCustomId("crab-exclude_reason")
    .setRequired(true)
    .setLabel("Reason of Exclusion:")
    .setStyle(TextInputStyle.Paragraph)
    const proofLinkInput = new TextInputBuilder()
    .setCustomId("crab-exclude_proof")
    .setRequired(true)
    .setLabel("Link 1 Proof File")
    .setStyle(TextInputStyle.Paragraph)

    const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(userIdInput)
    const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput)
    const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(proofLinkInput)
    modal.addComponents(row1, row2, row3)
    interaction.showModal(modal)
  }
}