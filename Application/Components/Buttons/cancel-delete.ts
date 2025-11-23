import { MessageFlags, ButtonInteraction } from 'discord.js'

const CrabConfig = require('../../schemas/CrabConfig')

module.exports = {
  customId: 'crab-button-cancel',
  execute: async (interaction: ButtonInteraction) => {
    interaction.update({ content: "Action canceled, the shift has not been deleted.", components: [] })
    setTimeout(async () => {
      try 
      {
          await interaction.deleteReply();
      } 
      catch (error) 
      {
          console.error('Failed to delete interaction reply:', error);
      }
  }, 10000);
  }
}