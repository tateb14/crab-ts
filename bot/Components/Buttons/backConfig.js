const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')

module.exports = {
  customId: 'crab-button_back',
  execute: async (interaction) => {
    const GuildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id }) 
    const departmentType = GuildConfig.crab_DepartmentType
    const embed = interaction.message.embeds[0]
    if (departmentType === 'leo') {
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
             .setValue('crab-sm_staff'),
             new StringSelectMenuOptionBuilder()
             .setEmoji('<:crab_repeat:1349598027236769822>')
             .setLabel('Change Module')
             .setValue('crab-sm_change'),
       );
       const row = new ActionRowBuilder().addComponents(leoSelect);
       interaction.update({ embeds: [ConfigEmbed], components: [row] })
    } else if (departmentType === 'fd-med') {
      const ConfigEmbed = EmbedBuilder.from(embed)
      ConfigEmbed.setDescription(`You have selected the **Fire and Medical** department type.\n\nNow, you will configure the modules for the **Fire and Medical** commands. The **Fire and Medical** type will allow the following modules to be used:\n* **<:crab_lock_pass:1349197473339670559> Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **<:crab_clock:1349595336389427221> Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n* **<:crab_flag:1349595334463979550> Reports**\n  * Easily log your reports like: inspection reports, fire reports, medical reports, and more!\n* **<:crab_trending_up:1349595567763751012> Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **<:crab_repeat:1349598027236769822> Change Module**\n  * Switch the module from **Fire and Medical** to **Law Enforcement** or **Department of Transportation** easily!`)

      const fdMedSelect = new StringSelectMenuBuilder()
      .setCustomId('crab-sm_fd-med-plugins')
      .setPlaceholder('Configure Fire and Medical Plugins')
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
            .setEmoji('<:crab_flag:1349595334463979550>')
            .setLabel('Reports')
            .setValue('crab-sm_reports'),
            new StringSelectMenuOptionBuilder()
            .setEmoji('<:crab_trending_up:1349595567763751012>')
            .setLabel('Promotions, Infractions, and Demotions')
            .setValue('crab-sm_staff'),
            new StringSelectMenuOptionBuilder()
            .setEmoji('<:crab_repeat:1349598027236769822>')
            .setLabel('Change Module')
            .setValue('crab-sm_change'),
      )
      const row = new ActionRowBuilder().addComponents(fdMedSelect);
      interaction.update({ embeds: [ConfigEmbed], components: [row] })
    } else if (departmentType === 'dot') {
      const ConfigEmbed = EmbedBuilder.from(embed)
      ConfigEmbed.setDescription(`You have selected the **Department of Transportation** department type.\n\nNow, you will configure the modules for the **Department of Transportation** commands. The **Department of Transportation** type will allow the following modules to be used:\n* **<:crab_lock_pass:1349197473339670559> Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **<:crab_clock:1349595336389427221> Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n* **<:crab_flag:1349595334463979550> Reports**\n  * Easily log your reports like: tow reports, scene reports, repair logs, and more!\n* **<:crab_trending_up:1349595567763751012> Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **<:crab_repeat:1349598027236769822> Change Module**\n  * Switch the module from **Department of Transportation** to **Law Enforcement** or **Fire and Medical** easily!`)

      const dotSelect = new StringSelectMenuBuilder()
      .setCustomId('crab-sm_dot-plugins')
      .setPlaceholder('Configure Department of Transportation Plugins')
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
            .setEmoji('<:crab_flag:1349595334463979550>')
            .setLabel('Reports')
            .setValue('crab-sm_reports'),
            new StringSelectMenuOptionBuilder()
            .setEmoji('<:crab_trending_up:1349595567763751012>')
            .setLabel('Promotions, Infractions, and Demotions')
            .setValue('crab-sm_staff'),
            new StringSelectMenuOptionBuilder()
            .setEmoji('<:crab_repeat:1349598027236769822>')
            .setLabel('Change Module')
            .setValue('crab-sm_change'),
      )
      const row = new ActionRowBuilder().addComponents(dotSelect)
      interaction.update({ embeds: [ConfigEmbed], components: [row] })
    }
  }
}
