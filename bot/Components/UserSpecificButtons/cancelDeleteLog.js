const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags } = require('discord.js')

module.exports = {
  customIdPrefix: 'crab_button-cancel_delete',
  execute: async (interaction) => {
    const [ _, messageId, authorizedUser] = interaction.customId.split(":")
    const message = await interaction.channel.messages.fetch(messageId)
    await message.edit({ content: "<:crab_search:1412973394114248857> **Processing** your request...", components: [] })
    if (authorizedUser !== interaction.user.id) {
      return message.edit({ content: "<:crab_x:1409708189896671357> **Access denied**, only the executor of this command can interact with this button." })
    }
    return message.edit({ content: "<:crab_check:1409695243816669316> Action canceled, I did not void any logs.", components: [] })
  }
}
