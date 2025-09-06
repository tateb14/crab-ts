const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, inlineCode } = require('discord.js')
const CrabConfig = require("../../schemas/CrabConfig")
const { fire_truck, officer, traffic_light, message, lock_pass, barrier, clock, clipboard, flag, trending_up, repeat } = require("../../../emojis.json")

module.exports = {
  customId: 'crab-sm_dot',
  execute: async (interaction) => {
    const embed = interaction.message.embeds[0]
    const ConfigEmbed = EmbedBuilder.from(embed)
    const GuildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id })
    const GuildPrefix = GuildConfig.crab_Prefix || '-'
    ConfigEmbed.setDescription(`You have selected the **Department of Transportation** department type.\n\nNow, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n* **${lock_pass} Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **${message} Configure Prefix**\n  * Change Crab"s prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(GuildPrefix)}\n* **${clock} Shift Logging**\n  * Easily log your department personnel"s shifts with our shift logging system!\n* **${flag} Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n* **${trending_up} Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **${repeat} Change Module**\n  * Switch the module from **Department of Transportation** to **Fire and Medical** or **Law Enforcement** easily!`)

    const dotSelect = new StringSelectMenuBuilder()
    .setCustomId('crab-sm_dot-plugins')
    .setPlaceholder('Configure Department of Transportation Plugins')
    .setOptions(
            new StringSelectMenuOptionBuilder()
              .setEmoji(lock_pass)
              .setLabel("Configure Permissions")
              .setValue("crab-sm_perms"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(message)
              .setLabel("Configure Prefix")
              .setValue("crab-sm_prefix"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(clock)
              .setLabel("Shift Logging")
              .setValue("crab-sm_shifts"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(flag)
              .setLabel("Reports")
              .setValue("crab-sm_reports"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(trending_up)
              .setLabel("Promotions, Infractions, and Demotions")
              .setValue("crab-sm_staff"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(repeat)
              .setLabel("Change Module")
              .setValue("crab-sm_change")
          );
    const row = new ActionRowBuilder().addComponents(dotSelect)
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { crab_DepartmentType: 'dot' } },
      { upsert: true, new: true }
    )
    interaction.update({ embeds: [ConfigEmbed], components: [row] })
  }
}
