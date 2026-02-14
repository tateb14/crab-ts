import { EmbedBuilder, ChannelSelectMenuBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction } from 'discord.js'
import { emojis } from '../../../config'

export default {
  customId: 'crab-sm_reports',
  execute: async (interaction: StringSelectMenuInteraction) => {
    const embed = interaction.message.embeds[0]
    const configEmbed = EmbedBuilder.from(embed)
    configEmbed.setDescription(`You are now configuring the **reports** module of Crab! Below you will find the configuration you will set:\n* **Report Logging**\n  * Select the channel you wish to log your reports in.`)
    
    const reportLogMenu = new ChannelSelectMenuBuilder()
      .setChannelTypes(ChannelType.GuildText)
      .setCustomId('crab-sm_reports-log')
      .setPlaceholder('Report Logging')
      .setMaxValues(1)
    
    const backButton = new ButtonBuilder()
      .setCustomId('crab-button_back')
      .setEmoji(emojis.back_arrow)
      .setLabel('Back')
      .setStyle(ButtonStyle.Success)
    
    const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(reportLogMenu)
    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(backButton)
    
    await interaction.update({ embeds: [configEmbed], components: [row, row2] })
  }
}
