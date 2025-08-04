const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags, ButtonBuilder, ButtonStyle, User } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
const UserShift = require("../../schemas/UserShift")
const ShiftLog = require("../../schemas/ShiftLog")
const humanizeDuration = require('humanize-duration')
module.exports = {
  customIdPrefix: `crab-buttons_start-shift`,
  execute: async (interaction, client) => {
    const userId = interaction.customId.split(":")[1]
    const guildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id })
    const OnDutyRole = guildConfig.shift_OnDuty
    const onDutyRoleObj = interaction.guild.roles.cache.get(OnDutyRole);
    const botMember = await interaction.guild.members.fetch(client.user.id);
    const BotRole = botMember.roles.highest;
    if (interaction.user.id !== userId) {
      await interaction.update({})
      await interaction.followUp({ content: 'You **cannot** interact with this button.', flags: MessageFlags.Ephemeral })
    } else {
      const userInfo = UserShift.findOne({ guildId: interaction.guild.id, shift_User: userId })
      const totalShiftTime = userInfo.shift_Total;
      const shiftStatus = UserShift.shift_Status;
      const totalTimeOnline = humanizeDuration(totalShiftTime, {
        round: true,
      })
      const startTime = Date.now()
      const discordStartTime = Math.floor((Date.now()) / 1000);
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
          name: 'Current Shift Time Online',
          value: `${totalTimeOnline}`
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
      .setEmoji('<:crab_clock_pause:1350701435116847216>')
      .setStyle(ButtonStyle.Secondary)
      const EndButton = new ButtonBuilder()
      .setCustomId(`crab-buttons_shift-end:${interaction.user.id}`)
      .setLabel('End Shift')
      .setEmoji('<:crab_clock_stop:1350701433980325979>')
      .setStyle(ButtonStyle.Danger)
      const newRow = new ActionRowBuilder().addComponents(startButton, BreakButton, EndButton)
      if (interaction.guild.roles.cache.has(OnDutyRole)) {
        if (BotRole.position <= onDutyRoleObj.position) {
          return interaction.reply({ content: `I cannot assign roles to this user. Please edit my role position to be above the <@&${OnDutyRole}> role.`, flags: MessageFlags.Ephemeral })
        }
        try {
          if (!interaction.member.roles.cache.has(OnDutyRole)){
          await interaction.member.roles.add(OnDutyRole)
          }
        } catch (error) {
          console.error(error)
        }
      }
      await UserShift.findOneAndUpdate(
        { guildId: interaction.guild.id, shift_User: interaction.user.id },
        { $set: { shift_start: startTime, shift_OnDuty: true } },
        { upsert: true, new: true }
      )
    interaction.update({ embeds: [startedEmbed], components: [newRow] })
}
  }
}
