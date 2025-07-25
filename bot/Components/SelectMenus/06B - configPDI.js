const { EmbedBuilder, ChannelSelectMenuBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
  customId: 'crab-sm_staff',
  execute: async (interaction) => {
    const embed = interaction.message.embeds[0]
    const ConfigEmbed = EmbedBuilder.from(embed)
    ConfigEmbed.setDescription(`You are now configuring the **Promtion, Demotion, and Infraction** module of Crab! Below you will find the configuration you will set:\n* **Infraction Logging**\n  * Select the channel you wish to log your infractions in.\n* **Promotion Logging**\n  * Select the channel you wish to log your promotions in.\n* **Demotion Logging**\n  * Select the channel you wish to log your demotions in.\n* **Discipline Appeal Link**\n  * **[OPTIONAL]** Type the link you wish to use as your appeal link for any discipline action sent in your department. From that menu, you can also clear the link.`)

    const InfractionLogMenu = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText)
    .setCustomId('crab-sm_punish-log')
    .setPlaceholder('Punishment Logging.')
    .setMaxValues(1);
    const PromotionLogMenu = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText)
    .setCustomId('crab-sm_promote-log')
    .setPlaceholder('Promotion Logging')
    .setMaxValues(1);
    const backButton = new ButtonBuilder()
    .setCustomId('crab-button_back')
    .setEmoji("<:crab_back_arrow:1350551176780972113>")
    .setLabel('Back')
    .setStyle(ButtonStyle.Success);
    const row1 = new ActionRowBuilder().addComponents(InfractionLogMenu)
    const row2 = new ActionRowBuilder().addComponents(PromotionLogMenu)
    const row3 = new ActionRowBuilder().addComponents(backButton)
    interaction.update({ embeds: [ConfigEmbed], components: [row1, row2, row3] })
  }
}
