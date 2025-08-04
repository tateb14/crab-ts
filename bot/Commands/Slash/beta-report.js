const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  MessageFlags,
  inlineCode,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("beta-report")
    .setDescription("Report an issue or a suggestion to the Crab engineers!")
    .addStringOption(option => option
      .setName("type")
      .setRequired(true)
      .setDescription("Select the type of report you will be submitting: Suggestion or Bug")
      .addChoices(
        { name: "Suggestion", value: "Suggestion" },
        { name: "Bug", value: "Bug" }
      )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  execute: async (interaction) => {
    const type = interaction.options.getString("type")
    const modal = new ModalBuilder()
    .setCustomId(`crab-modal_report-beta:${type}`)
    .setTitle(`${type} - Beta Server Report Form`)
    
    const description = new TextInputBuilder()
    .setCustomId(`crab-input_beta-report-description`)
    .setLabel(`Describe the ${type} below!`)
    .setMinLength(50)
    .setMaxLength(600)
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph)
    const row = new ActionRowBuilder().addComponents(description)
    modal.addComponents(row)

    await interaction.showModal(modal)
  },
};
