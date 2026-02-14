import { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, StringSelectMenuInteraction } from 'discord.js'
import crabConfig from '../../../Models/crab-config'
import { emojis } from '../../../config'

export default {
  customId: 'crab-sm_le',
  execute: async (interaction: StringSelectMenuInteraction) => {
    const embed = interaction.message.embeds[0]
    const configEmbed = EmbedBuilder.from(embed)
    configEmbed.setDescription(`You have selected the **Law Enforcement** department type.\n\nNow, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n* **${emojis.lock_pass} Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **${emojis.clock} Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n* **${emojis.clipboard} Record Management**\n  * Seamlessly record your arrests, citations, and traffic warnings using our record management system.\n* **${emojis.flag} Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n* **${emojis.trending_up} Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **${emojis.repeat} Change Module**\n  * Switch the module from **Law Enforcement** to **Fire and Medical** or **Department of Transportation** easily!`)
    
    const leoSelect = new StringSelectMenuBuilder()
      .setCustomId('crab-sm_le-plugins')
      .setPlaceholder('Configure Law Enforcement Plugins')
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
          .setEmoji(emojis.clipboard)
          .setLabel('Record Management')
          .setValue('crab-sm_records'),
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
    
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(leoSelect)
    
    await crabConfig.findOneAndUpdate(
      { guildId: interaction.guild!.id },
      { $set: { crab_DepartmentType: 'leo' } },
      { upsert: true, new: true }
    )
    
    await interaction.update({ embeds: [configEmbed], components: [row] })
  }
}
