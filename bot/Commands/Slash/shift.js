const { SlashCommandBuilder, MessageFlags, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
const UserShift = require('../../schemas/UserShift')
const humanizeDuration = require('humanize-duration')
module.exports = {
  data: new SlashCommandBuilder()
  .setName('shift')
  .setDescription('..')
  .addSubcommand(subcommand =>
    subcommand
    .setName('manage')
    .setDescription('Manage your shift.')
    .addStringOption(option => 
      option.setName('type')
      .setRequired(false)
      .setDescription('Log your shift on a specific type if you wish!')
      .addChoices(
        { name: 'Patrol', value: 'patrol-shift' },
        { name: 'SWAT', value: 'swat-shift' },
        { name: 'Internal Affairs', value: 'ia-shift' },
        { name: 'Detective', value: 'detective-shift' }
      )
    )
  )
  .addSubcommand(subcommand =>
    subcommand
    .setName('active')
    .setDescription('List all active shifts.')
  )
  .addSubcommand(subcommand =>
    subcommand
    .setName('admin')
    .setDescription("Manage a user's shift.")
  ),
  execute: async (interaction) => {
    const subcommand = interaction.options.getSubcommand()
    const guildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id })
    const userInfo = await UserShift.findOne({ shift_User: interaction.user.id, guildId: interaction.guild.id })
    const staffRole =  guildConfig.perms_PersonnelRole
    const aaRole = guildConfig.perms_AllAccessRole
    if (!interaction.member.roles.cache.has(staffRole) || !interaction.member.roles.cache.has(aaRole)) {
      interaction.reply({ content: '**Insufficient** permissions.', flags: MessageFlags.Ephemeral })
    } else {
    if (subcommand === 'manage') {
      const shiftType = interaction.options.getString('type') || 'default'
      const departmentTypes = guildConfig.shift_Types
      if (!userInfo) {
        const newShiftUser = new UserShift({
          guildId: interaction.guild.id,
          shift_User: interaction.user.id,
          shift_Type: shiftType,
          shift_OnDuty: false,
          shift_OnBreak: false,
          shift_Total: 0,
          shift_TotalBreakTime: 0,
        })
        await newShiftUser.save()
      }
      const totalTime = userInfo.shift_Total

      if (departmentTypes.includes(shiftType) || shiftType === 'default') {
        const totalShiftTime = UserShift.shift_Total
        const totalTimeOnline = humanizeDuration(totalShiftTime, {
          round: true,
        })
        const embed = new EmbedBuilder()
        .setAuthor({ name: `@${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        .setColor(0x572626)
        .setDescription(`${interaction.user}, you can manage your shift below.`)
        .addFields(
          {
            name: 'Current Status',
            value: `<:crab_offline:1350630808666374205> Off Duty`
          },
          {
            name: 'Time Online',
            value: `${totalTimeOnline}`
          },
        )
        const startButton = new ButtonBuilder()
        .setCustomId(`crab-buttons_start-shift:${interaction.user.id}`)
        .setEmoji('<:crab_clock_play:1350635274857611375>')
        .setLabel('Start Shift')
        .setStyle(ButtonStyle.Success)
        const row = new ActionRowBuilder().addComponents(startButton)
        interaction.reply({ embeds: [embed], components: [row] })
      } else {
        interaction.reply({ content: "This shift type is **disabled** in this department. Please select another shift type or contact your department administrator.", flags: MessageFlags.Ephemeral })
      }
    } else if (subcommand === 'active') {
      const OnlinePersonnel = await UserShift.find({ guildId: interaction.guild.id, shift_OnDuty: true })
      const OnlineUser = await UserShift.find({ guildId: interaction.guild.id, shift_OnDuty: true, shift_OnBreak: false })
      const BreakUser = await UserShift.find({ guildId: interaction.guild.id, shift_OnBreak: true })
      console.log(BreakUser)
      if (!OnlinePersonnel || OnlinePersonnel.length === 0) {
        const embed = new EmbedBuilder()
        .setTitle(`Displaying ${OnlineUser.length + BreakUser.length} Active Personnel`)
        .setColor(0x2A9D8F)
        .setDescription("Currently no active personnel were found.")

        return interaction.reply({ embeds: [embed] })
      } else {
      const embed = new EmbedBuilder()
      .setTitle(`Displaying ${OnlineUser.length + BreakUser.length} Active Personnel`)
      .setColor(0x2A9D8F)
      let OnlineUsers = []
      console.log(OnlineUsers)
      let BreakUsers = []
      console.log(BreakUsers)
      for (const User of OnlineUser) {
        OnlineUsers.push(`<@${User.shift_User}>\n`)
        console.log(OnlineUsers)
      }
      for (const User of BreakUser) {
        BreakUsers.push(`<@${User.shift_User}>\n`)
        console.log(BreakUsers)
      }
      embed.addFields(
        {
          name: "Current On Duty Personnel",
          value: `${OnlineUsers}`
        }
      )
      if (OnlineUsers.length < 1) {
        embed.addFields(
          {
            name: "Currently On Duty Personnel",
            value: "No one is one duty!"
          }
        )
      } else {
        embed.addFields(
          {
            name: "Currently On Break Personnel",
            value: `${OnlineUsers}`
          }
        )
      }
      if (BreakUsers.length === 0 ) {
        embed.addFields(
          {
            name: "Currently On Break Personnel",
            value: "No one is one break!"
          }
        )
      } else {
        embed.addFields(
          {
            name: "Currently On Break Personnel",
            value: `${BreakUsers}`
          }
        )
      }
      interaction.reply({ embeds: [embed] })
    }
  }
  }
}

}
