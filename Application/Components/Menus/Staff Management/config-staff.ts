import { EmbedBuilder, ChannelSelectMenuBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction, AttachmentBuilder } from 'discord.js'
import { emojis } from '../../../config'

export default {
  customId: 'crab-sm_staff',
  execute: async (interaction: StringSelectMenuInteraction) => {
    const embed = interaction.message.embeds[0]
    const configEmbed = EmbedBuilder.from(embed)
    
    const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
      name: "embed-footer-banner.png"
    })
    
    configEmbed.setImage("attachment://embed-footer-banner.png")
    configEmbed.setDescription(`You are now configuring the **Promotion, Demotion, and Infraction** module of Crab! Below you will find the configuration you will set:\n* **Infraction Logging**\n  * Select the channel you wish to log your infractions in.\n* **Promotion Logging**\n  * Select the channel you wish to log your promotions in.\n* **Demotion Logging**\n  * Select the channel you wish to log your demotions in.`)
    
    const infractionLogMenu = new ChannelSelectMenuBuilder()
      .setChannelTypes(ChannelType.GuildText)
      .setCustomId('crab-sm_infract-log')
      .setPlaceholder('Infraction Logging')
      .setMaxValues(1)
    
    const promotionLogMenu = new ChannelSelectMenuBuilder()
      .setChannelTypes(ChannelType.GuildText)
      .setCustomId('crab-sm_promote-log')
      .setPlaceholder('Promotion Logging')
      .setMaxValues(1)
    
    const demotionLogMenu = new ChannelSelectMenuBuilder()
      .setChannelTypes(ChannelType.GuildText)
      .setCustomId('crab-sm_demote-log')
      .setPlaceholder('Demotion Logging')
      .setMaxValues(1)
    
    const backButton = new ButtonBuilder()
      .setCustomId('crab-button_back')
      .setEmoji(emojis.back_arrow)
      .setLabel('Back')
      .setStyle(ButtonStyle.Success)
    
    const row1 = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(infractionLogMenu)
    const row2 = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(promotionLogMenu)
    const row3 = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(demotionLogMenu)
    const row4 = new ActionRowBuilder<ButtonBuilder>().addComponents(backButton)
    
    await interaction.update({ embeds: [configEmbed], components: [row1, row2, row3, row4], files: [embedFooter] })
  }
}
