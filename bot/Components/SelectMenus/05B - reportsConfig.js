const { EmbedBuilder, ChannelSelectMenuBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { back_arrow } = require("../../../emojis.json")
module.exports = {
  customId: 'crab-sm_reports',
  execute: async (interaction) => {
    const embed = interaction.message.embeds[0]
    const ConfigEmbed = EmbedBuilder.from(embed)
    ConfigEmbed.setDescription(`You are now configuring the **reports** module of Crab! Below you will find the configuration you will set:\n* **Report Logging**\n  * Select the channel you wish to log your reports in.`)

    const ReportLogMenu = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText)
    .setCustomId('crab-sm_reports-log')
    .setPlaceholder('Report Logging')
    .setMaxValues(1);
    const backButton = new ButtonBuilder()
    .setCustomId('crab-button_back')
    .setEmoji(back_arrow)
    .setLabel('Back')
    .setStyle(ButtonStyle.Success);
    const row = new ActionRowBuilder().addComponents(ReportLogMenu)
    const row2 = new ActionRowBuilder().addComponents(backButton)
    interaction.update({ embeds: [ConfigEmbed], components: [row, row2] })
  }
}
