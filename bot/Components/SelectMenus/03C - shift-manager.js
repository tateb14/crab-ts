const { MessageFlags, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const ShiftLog = require('../../schemas/ShiftLog')
const humanizeDuration = require('humanize-duration')

module.exports = {
  customId: 'crab-sm_shift-admin-options',
  execute: async (interaction) => {
    const shiftId = interaction.values[0]
    const shift = await ShiftLog.findOne({ guildId: interaction.guild.id, shift_id: shiftId })
    const totalTimeOnline = humanizeDuration(shift.shift_Time, {
      round: true,
    })
    const totalBreakTime = humanizeDuration(shift.shift_BreakTime, {
      round: true,
    })
    const embed = new EmbedBuilder()
    .setTitle(`${shiftId} Management Panel`)
    .setColor(0xfaf3e0)
    .setTimestamp()
    .setFooter({ text: `Shift Management | Powered by Crab` })
    .addFields(
      {
        name: "Shift User:",
        value: `<@${shift.shift_User}>`,
      },
      {
        name: "Total Shift Time:",
        value: totalTimeOnline,
      },
      {
        name: "Total Break Time:",
        value: totalBreakTime,
      },
    )
    const AddTime = new ButtonBuilder()
    .setCustomId(`crab-button_shift-add-time:${shiftId}`)
    .setEmoji("<:crab_clockadd:1402657630777769995>")
    .setLabel("Add Time")
    .setStyle(ButtonStyle.Success)
    const RemoveTime = new ButtonBuilder()
    .setCustomId(`crab-button_shift-subtract-time:${shiftId}`)
    .setEmoji("<:crab_clockminus:1402658075902480494>")
    .setLabel("Subtract Time")
    .setStyle(ButtonStyle.Secondary)
    const DeleteShift = new ButtonBuilder()
    .setCustomId(`crab-button_shift-delete:${shiftId}`)
    .setEmoji("<:crab_clockx:1402658429323051220>")
    .setLabel("Delete Shift")
    .setStyle(ButtonStyle.Danger)
    const row1 = new ActionRowBuilder().addComponents(AddTime, RemoveTime, DeleteShift)
    await interaction.update({ embeds: [embed], components: [row1] })
  }
}
