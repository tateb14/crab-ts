const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, inlineCode } = require('discord.js')
const CrabConfig = require("../../schemas/CrabConfig")
module.exports = {
  customId: 'crab-sm_fd-med',
  execute: async (interaction) => {
    const embed = interaction.message.embeds[0]
    const ConfigEmbed = EmbedBuilder.from(embed)
    const GuildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id })
    const GuildPrefix = GuildConfig.crab_Prefix || '-'
    ConfigEmbed.setDescription(`You have selected the **Fire and Medical** department type.\n\nNow, you will configure the modules for the **Fire and Medical** commands. The **Fire and Medical** type will allow the following modules to be used:\n* **<:crab_lock_pass:1349197473339670559> Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **<:crab_message:1399409507062382764> Configure Prefix**\n  * Change Crab's prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(GuildPrefix)}\n* **<:crab_clock:1349595336389427221> Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n* **<:crab_flag:1349595334463979550> Reports**\n  * Easily log your reports like: inspection reports, fire reports, medical reports, and more!\n* **<:crab_trending_up:1349595567763751012> Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **<:crab_repeat:1349598027236769822> Change Module**\n  * Switch the module from **Fire and Medical** to **Law Enforcement** or **Department of Transportation** easily!`)

    const fdMedSelect = new StringSelectMenuBuilder()
    .setCustomId('crab-sm_fd-med-plugins')
    .setPlaceholder('Configure Fire and Medical Plugins')
    .setOptions(
      new StringSelectMenuOptionBuilder()
          .setEmoji('<:crab_lock_pass:1349197473339670559>')
          .setLabel('Configure Permissions')
          .setValue('crab-sm_perms'),
      new StringSelectMenuOptionBuilder()
          .setEmoji('<:crab_message:1399409507062382764>')
          .setLabel('Configure Prefix')
          .setValue('crab-sm_prefix'),
      new StringSelectMenuOptionBuilder()
          .setEmoji('<:crab_clock:1349595336389427221>')
          .setLabel('Shift Logging')
          .setValue('crab-sm_shifts'),
          new StringSelectMenuOptionBuilder()
          .setEmoji('<:crab_flag:1349595334463979550>')
          .setLabel('Reports')
          .setValue('crab-sm_reports'),
          new StringSelectMenuOptionBuilder()
          .setEmoji('<:crab_trending_up:1349595567763751012>')
          .setLabel('Promotions, Infractions, and Demotions')
          .setValue('crab-sm_pdi'),
          new StringSelectMenuOptionBuilder()
          .setEmoji('<:crab_repeat:1349598027236769822>')
          .setLabel('Change Module')
          .setValue('crab-sm_change'),
    )
    const row = new ActionRowBuilder().addComponents(fdMedSelect)
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { crab_DepartmentType: 'fd-med' } },
      { upsert: true, new: true }
    )
    interaction.update({ embeds: [ConfigEmbed], components: [row] })
  }
}
