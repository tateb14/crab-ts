import { ActionRowBuilder, ButtonInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

module.exports = {
  customId: 'crab-exclude_guild',
  execute: async (interaction: ButtonInteraction, client: Client) => {
    const modal = new ModalBuilder()
    .setCustomId("crab-modal_guild-exclude")
    .setTitle("Guild Exclusion Form")
    const guildIdInput = new TextInputBuilder()
    .setCustomId("crab-exclude_guild-id")
    .setLabel("Guild ID:")
    .setPlaceholder("e.g. 1348623820331679744")
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

    const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(guildIdInput)
    const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput)
    const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(proofLinkInput)
    modal.addComponents(row1, row2, row3)
    interaction.showModal(modal)
  }
}