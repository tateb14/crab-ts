const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags } = require('discord.js')
const { search, x, check } = require("../../../emojis.json")
module.exports = {
  customIdPrefix: 'crab_button-cancel_delete',
  execute: async (interaction) => {
    const [ _, messageId, authorizedUser] = interaction.customId.split(":")
    const message = await interaction.channel.messages.fetch(messageId)
    await message.edit({ content: `${search} **Processing** your request...`, components: [] })
    if (authorizedUser !== interaction.user.id) {
      return message.edit({ content: `${x} **Access denied**, only the executor of this command can interact with this button.` })
    }
    return message.edit({ content: `${check} Action canceled, I did not void any logs.`, components: [] })
  }
}
