import { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction, AttachmentBuilder } from 'discord.js'
import crabConfig from '../../../Models/crab-config'
import { emojis } from '../../../config'

export default {
  customId: 'crab-sm_dot',
  execute: async (interaction: StringSelectMenuInteraction) => {
    const embed = interaction.message.embeds[0]
    const configEmbed = EmbedBuilder.from(embed)
    configEmbed.setDescription(`You have selected the **Department of Transportation** department type.\n\nNow, you will configure the modules for the **Department of Transportation** commands. The **Department of Transportation** type will allow the following modules to be used:\n* **${emojis.lock_pass} Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **${emojis.clock} Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n* **${emojis.flag} Reports**\n  * Easily log your reports like: tow reports, scene reports, repair logs, and more!\n* **${emojis.trending_up} Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **${emojis.repeat} Change Module**\n  * Switch the module from **Department of Transportation** to **Law Enforcement** or **Fire and Medical** easily!`)
    
    const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
      name: "embed-footer-banner.png"
    })
    
    configEmbed.setImage("attachment://embed-footer-banner.png")
    
    const dotSelect = new StringSelectMenuBuilder()
      .setCustomId('crab-sm_dot-plugins')
      .setPlaceholder('Configure Department of Transportation Plugins')
      .setOptions(
        new StringSelectMenuOptionBuilder()
          .setEmoji(emojis.lock_pass)
          .setLabel('Configure Permissions')
          .setValue('crab-sm_perms'),
        new StringSelectMenuOptionBuilder()
          .setEmoji(emojis.clock)
          .setLabel('Shift Logging')
          .setValue('crab-sm_shifts'),
        new StringSelectMenuOptionBuilder()
          .setEmoji(emojis.flag)
          .setLabel('Reports')
          .setValue('crab-sm_reports'),
        new StringSelectMenuOptionBuilder()
          .setEmoji(emojis.trending_up)
          .setLabel('Promotions, Infractions, and Demotions')
          .setValue('crab-sm_pdi'),
        new StringSelectMenuOptionBuilder()
          .setEmoji(emojis.repeat)
          .setLabel('Change Module')
          .setValue('crab-sm_change')
      )
    
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(dotSelect)
    
    await crabConfig.findOneAndUpdate(
      { guildId: interaction.guild!.id },
      { $set: { crab_DepartmentType: 'dot' } },
      { upsert: true, new: true }
    )
    
    await interaction.update({ embeds: [configEmbed], components: [row], files: [embedFooter] })
  }
}
