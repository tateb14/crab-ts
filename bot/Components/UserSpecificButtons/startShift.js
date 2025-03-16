const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags, ButtonBuilder, ButtonStyle } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')

module.exports = {
  customIdPrefix: `crab-buttons_start-shift`,
  execute: async (interaction) => {
    const startTime = Date.now()
    console.log(interaction.message)
    let embed = interaction.message.embeds[0]
    embed = EmbedBuilder.from(embed)
    const discordStartTime = Math.floor((Date.now()) / 1000);
    const userId = interaction.customId.split(":")[1]
    if (interaction.user.id !== userId) {
      await interaction.update({})
      await interaction.followUp({ content: 'You **cannot** interact with this button.', flags: MessageFlags.Ephemeral })
    } else {
      const startedEmbed = new EmbedBuilder()
      .setColor(0x2A9D8F)
      .setTitle('Shift Management')
      .setDescription(`${interaction.user}, you can manage your shift below.`)
      .addFields(
        {
          name: 'Current Status',
          value: `<:crab_online:1350630807022207017> On Duty`
        },
        {
          name: 'Time Online',
          value: `TBWO`
        },
        {
          name: 'Shift Started',
          value: `<t:${discordStartTime}:R>`
        }
      )
      const Buttons = interaction.message.components
      const row = ActionRowBuilder.from(Buttons[0])
      const startButton = row.components[0]
      startButton.setDisabled(true)
      const BreakButton = new ButtonBuilder()
      .setCustomId(`crab-buttons_shift-break:${interaction.user.id}`)
      .setLabel('Toggle Break')
      .setStyle(ButtonStyle.Secondary)
      const EndButton = new ButtonBuilder()
      .setCustomId(`crab-buttons_shift-end:${interaction.user.id}`)
      .setLabel('End Shift')
      .setStyle(ButtonStyle.Danger)
      const newRow = new ActionRowBuilder().addComponents(startButton, BreakButton, EndButton)
    interaction.update({ embeds: [startedEmbed], components: [newRow] })
}
  }
}
