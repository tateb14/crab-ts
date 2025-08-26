const {
  ActionRowBuilder,
  EmbedBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  inlineCode,
  StringSelectMenuOptionBuilder
} = require("discord.js");
const ShiftLog = require("../../schemas/ShiftLog");
const humanizeDuration = require("humanize-duration")
module.exports = {
  customIdPrefix: "crab-button_cancel",
  execute: async (interaction, client) => {
    interaction.reply({ content: "Action **canceled**, I have **not** deleted the shift.", flags: MessageFlags.Ephemeral })
  },
};
