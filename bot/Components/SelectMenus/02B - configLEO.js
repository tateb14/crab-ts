const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js')

module.exports = {
  customId: 'crab-sm_le',
  execute: async (interaction) => {
    const embed = interaction.message.embeds[0]
    const CrabConfig = require("../../schemas/CrabConfig")
    const ConfigEmbed = EmbedBuilder.from(embed)
    ConfigEmbed.setDescription(`You have selected the **Law Enforcement** department type.\n\nNow, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n* **<:crab_lock_pass:1349197473339670559> Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **<:crab_clock:1349595336389427221> Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n* **<:crab_clipboard:1349595335378337833> Record Management**\n  * Seamlessly record your arrests, citations, and traffic warnings using our record management system.\n* **<:crab_flag:1349595334463979550> Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n* **<:crab_trending_up:1349595567763751012> Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **<:crab_repeat:1349598027236769822> Change Module**\n  * Switch the module from **Law Enforcement** to **Fire and Medical** or **Department of Transportation** easily!`)

    const leoSelect = new StringSelectMenuBuilder()
    .setCustomId('crab-sm_le-plugins')
    .setPlaceholder('Configure Law Enforcement Plugins')
    .setOptions(
      new StringSelectMenuOptionBuilder()
          .setEmoji('<:crab_lock_pass:1349197473339670559>')
          .setLabel('Configure Permissions')
          .setValue('crab-sm_perms'),
      new StringSelectMenuOptionBuilder()
          .setEmoji('<:crab_clock:1349595336389427221>')
          .setLabel('Shift Logging')
          .setValue('crab-sm_shifts'),
          new StringSelectMenuOptionBuilder()
          .setEmoji('<:crab_clipboard:1349595335378337833>')
          .setLabel('Record Management')
          .setValue('crab-sm_records'),
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
    );
    const row = new ActionRowBuilder().addComponents(leoSelect);
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { crab_DepartmentType: 'leo' } },
      { upsert: true, new: true }
    )
    interaction.update({ embeds: [ConfigEmbed], components: [row] })
  }
}
