const { EmbedBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
module.exports = {
  customId: 'crab-sm_perms',
  execute: async (interaction) => {
    const embed = interaction.message.embeds[0]
    const ConfigEmbed = EmbedBuilder.from(embed)
    ConfigEmbed.setDescription(`You are now configuring the **personnel permissions** for Crab!\n\nBelow you will find select menus, you have the option to select the following:\n* **Standard Staff Role**\n  * The standard staff role is the main role all department personnel need to use shifts, reports, and more.\n* **High Commander Role**\n  * The High Commander Role will have permissions to issue promotions, infractions, and demotions; as well as manage shifts.\n* **All Access Staff**\n  * The All Access Staff role will allow said members to do any command using Crab.`)

    const staffMenu = new RoleSelectMenuBuilder()
    .setCustomId('crab-sm_perms-staff')
    .setPlaceholder('Select the Department Personnel role');
    const hicommMenu = new RoleSelectMenuBuilder()
    .setCustomId('crab-sm_perms-hicomm')
    .setPlaceholder('Select the High Commander role');
    const allAccessMenu = new RoleSelectMenuBuilder()
    .setCustomId('crab-sm_perms-aa')
    .setPlaceholder('Select the All Access role');
    const backButton = new ButtonBuilder()
    .setCustomId('crab-button_back')
    .setEmoji("<:crab_back_arrow:1350551176780972113>")
    .setLabel('Back')
    .setStyle(ButtonStyle.Success);

    const staffRow = new ActionRowBuilder().addComponents(staffMenu)
    const hicommRow = new ActionRowBuilder().addComponents(hicommMenu)
    const aaRow = new ActionRowBuilder().addComponents(allAccessMenu)
    const backRow = new ActionRowBuilder().addComponents(backButton)

    interaction.update({ embeds: [ConfigEmbed], components: [staffRow, hicommRow, aaRow, backRow] })
  }
}
