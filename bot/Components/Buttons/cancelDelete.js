const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')

module.exports = {
  customId: 'crab-button-cancel',
  execute: async (interaction) => {
    interaction.update({ content: "Action canceled, the shift has not been deleted.", components: [], flags: MessageFlags.Ephemeral })
    setTimeout(async () => {
      try {
          await interaction.deleteReply();
      } catch (error) {
          console.error('Failed to delete interaction reply:', error);
      }
  }, 10000);
  }
}
