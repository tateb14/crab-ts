const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, inlineCode } = require('discord.js')
const CrabConfig = require("../../schemas/CrabConfig")
module.exports = {
  customId: 'crab-sm_dot',
  execute: async (interaction) => {
    const embed = interaction.message.embeds[0]
    const ConfigEmbed = EmbedBuilder.from(embed)
    const GuildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id })
    const GuildPrefix = GuildConfig.crab_Prefix || '-'
    ConfigEmbed.setDescription(`You have selected the **Department of Transportation** department type.\n\nNow, you will configure the modules for the **Department of Transportation** commands. The **Department of Transportation** type will allow the following modules to be used:\n* **<:crab_lock_pass:1349197473339670559> Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **<:crab_message:1409695230466326628> Configure Prefix**\n  * Change Crab's prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(GuildPrefix)}\n* **<:crab_clock:1349595336389427221> Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n* **<:crab_flag:1349595334463979550> Reports**\n  * Easily log your reports like: tow reports, scene reports, repair logs, and more!\n* **<:crab_trending_up:1349595567763751012> Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **<:crab_repeat:1349598027236769822> Change Module**\n  * Switch the module from **Department of Transportation** to **Law Enforcement** or **Fire and Medical** easily!`)

    const dotSelect = new StringSelectMenuBuilder()
    .setCustomId('crab-sm_dot-plugins')
    .setPlaceholder('Configure Department of Transportation Plugins')
    .setOptions(
      new StringSelectMenuOptionBuilder()
              .setEmoji({ id: "1349197473339670559", name: "crab_lock_pass" })
              .setLabel("Configure Permissions")
              .setValue("crab-sm_perms"),
            new StringSelectMenuOptionBuilder()
              .setEmoji({ id: "1349595336389427221", name: "crab_clock" })
              .setLabel("Shift Logging")
              .setValue("crab-sm_shifts"),
            new StringSelectMenuOptionBuilder()
              .setEmoji({ id: "1349595334463979550", name: "crab_flag" })
              .setLabel("Reports")
              .setValue("crab-sm_reports"),
            new StringSelectMenuOptionBuilder()
              .setEmoji({ id: "1349595567763751012", name: "crab_trending_up" })
              .setLabel("Promotions, Infractions, and Demotions")
              .setValue("crab-sm_staff"),
            new StringSelectMenuOptionBuilder()
              .setEmoji({ id: "1349598027236769822", name: "crab_repeat" })
              .setLabel("Change Module")
              .setValue("crab-sm_change")
    )
    const row = new ActionRowBuilder().addComponents(dotSelect)
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { crab_DepartmentType: 'dot' } },
      { upsert: true, new: true }
    )
    interaction.update({ embeds: [ConfigEmbed], components: [row] })
  }
}
