import { EmbedBuilder, ChannelSelectMenuBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction, AttachmentBuilder } from 'discord.js'
import { emojis } from '../../../config'

export default {
  customId: 'crab-sm_records',
  execute: async (interaction: StringSelectMenuInteraction) => {
    const embed = interaction.message.embeds[0]
    const configEmbed = EmbedBuilder.from(embed)
    
    const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
      name: "embed-footer-banner.png"
    })
    
    configEmbed.setImage("attachment://embed-footer-banner.png")
    configEmbed.setDescription(`You are now configuring the **records** module of Crab! Below you will find the configuration you will set:\n* **Record Logging**\n  * Select the channel you wish to log your records in.`)
    
    const recordLogsMenu = new ChannelSelectMenuBuilder()
      .setChannelTypes(ChannelType.GuildText)
      .setCustomId('crab-sm_records-log')
      .setPlaceholder('Record Logging')
      .setMaxValues(1)
    
    const backButton = new ButtonBuilder()
      .setCustomId('crab-button_back')
      .setEmoji(emojis.back_arrow)
      .setLabel('Back')
      .setStyle(ButtonStyle.Success)
    
    const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(recordLogsMenu)
    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(backButton)
    
    await interaction.update({ embeds: [configEmbed], components: [row, row2], files: [embedFooter] })
  }
}
