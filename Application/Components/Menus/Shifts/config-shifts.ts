import { EmbedBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ActionRowBuilder, ChannelType, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuInteraction, AttachmentBuilder } from 'discord.js'
import { emojis } from '../../../config'

export default {
  customId: 'crab-sm_shifts',
  execute: async (interaction: StringSelectMenuInteraction) => {
    const embed = interaction.message.embeds[0]
    const configEmbed = EmbedBuilder.from(embed)
    
    const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
      name: "embed-footer-banner.png"
    })
    
    configEmbed.setImage("attachment://embed-footer-banner.png")
    configEmbed.setDescription(`You are now configuring the **shifts** module of Crab! Below you will find the configuration you will set:\n* **Shift Logging**\n  * Select the channel you wish to log your shifts in.\n* **On-Duty Role**\n  * Select the role you wish to set as the on duty role assigned to personnel on duty.\n* **On-Break Role**\n  * Select the role you wish to set as the on break role assigned to personnel on break.\n* **Shift Types**\n  * Select the shift types that best align with your server.\n-# If you need to clear the select menu options below, go to a different channel and then return to this one.`)
    
    const shiftLogChannelSelect = new ChannelSelectMenuBuilder()
      .setChannelTypes(ChannelType.GuildText)
      .setCustomId('crab-sm_shift-log')
      .setMaxValues(1)
      .setPlaceholder('Shift Logging')
    
    const shiftOdRoleSelect = new RoleSelectMenuBuilder()
      .setCustomId('crab-sm_on-duty-role')
      .setMaxValues(1)
      .setPlaceholder('On-Duty Role')
    
    const shiftObRoleSelect = new RoleSelectMenuBuilder()
      .setCustomId('crab-sm_on-break-role')
      .setMaxValues(1)
      .setPlaceholder('On-Break Role')
    
    // const shiftTypesMenu = new StringSelectMenuBuilder()
    //   .setCustomId('crab-sm_shift-types')
    //   .setMaxValues(4)
    //   .setPlaceholder('Shift Types')
    //   .addOptions(
    //     new StringSelectMenuOptionBuilder()
    //       .setLabel('Patrol')
    //       .setValue('patrol'),
    //     new StringSelectMenuOptionBuilder()
    //       .setLabel('SWAT')
    //       .setValue('swat'),
    //     new StringSelectMenuOptionBuilder()
    //       .setLabel('Internal Affairs')
    //       .setValue('ia'),
    //     new StringSelectMenuOptionBuilder()
    //       .setLabel('Detective')
    //       .setValue('detective')
    //   )
    
    const backButton = new ButtonBuilder()
      .setCustomId('crab-button_back')
      .setEmoji(emojis.back_arrow)
      .setLabel('Back')
      .setStyle(ButtonStyle.Success)
    
    const row1 = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(shiftLogChannelSelect)
    const row2 = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(shiftOdRoleSelect)
    const row3 = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(shiftObRoleSelect)
    // const row4 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(shiftTypesMenu)
    const row5 = new ActionRowBuilder<ButtonBuilder>().addComponents(backButton)
    
    await interaction.update({ embeds: [configEmbed], components: [row1, row2, row3, row5], files: [embedFooter] })
  }
}
