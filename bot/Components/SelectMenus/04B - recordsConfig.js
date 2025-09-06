const { EmbedBuilder, ChannelSelectMenuBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { back_arrow } = require("../../../emojis.json")
module.exports = {
  customId: 'crab-sm_records',
  execute: async (interaction) => {
    const embed = interaction.message.embeds[0]
    const ConfigEmbed = EmbedBuilder.from(embed)
    ConfigEmbed.setDescription(`You are now configuring the **records** module of Crab! Below you will find the configuration you will set:\n* **Record Logging**\n  * Select the channel you wish to log your records in.`)

    const RecordLogsMenu = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText)
    .setCustomId('crab-sm_records-log')
    .setPlaceholder('Record Logging')
    .setMaxValues(1);
    const backButton = new ButtonBuilder()
    .setCustomId('crab-button_back')
    .setEmoji(back_arrow)
    .setLabel('Back')
    .setStyle(ButtonStyle.Success);
    const row = new ActionRowBuilder().addComponents(RecordLogsMenu)
    const row2 = new ActionRowBuilder().addComponents(backButton)
    interaction.update({ embeds: [ConfigEmbed], components: [row, row2] })
  }
}
