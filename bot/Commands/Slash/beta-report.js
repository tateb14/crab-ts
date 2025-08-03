const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  MessageFlags,
  inlineCode
} = require("discord.js");
const crabConfig = require("../../schemas/CrabConfig.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report an issue or a suggestion to the Crab engineers!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
  },
};
