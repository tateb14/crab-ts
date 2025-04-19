const { ActionRowBuilder, EmbedBuilder } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
const CrabShifts = require('../../schemas/UserShift')
const humanizeDuration = require('humanize-duration')
module.exports = {
  customIdPrefix: 'crab-buttons_shift-end',
  execute: async (interaction, client) => {
    const userId = interaction.customId.split(":")[1]
    if (interaction.user.id !== userId) {
      await interaction.update({})
      await interaction.followUp({ content: 'You **cannot** interact with this button.', flags: MessageFlags.Ephemeral })
    } else {
    const UserShift = await CrabShifts.findOne({
      guildId: interaction.guild.id,
      shift_User: interaction.user.id,
    });
    const endTime = Date.now()
    const startTime = UserShift.shift_start
    const totalNBTime = endTime - startTime
    const totalShiftBreakTime = UserShift.shift_endBreak - UserShift.shift_startBreak || 0
    const totalTime = totalNBTime - totalShiftBreakTime
    await UserShift.updateOne({ $inc: { shift_total: +totalTime } }, { upsert: true, new: true })
    await UserShift.updateOne({ shift_OnDuty: false }, { upsert: true, new: true })
    await UserShift.updateOne({ shift_endBreak: null }, { upsert: true, new: true })
    await UserShift.updateOne({ shift_startBreak: null }, { upsert: true, new: true })
    await UserShift.updateOne({ shift_start: null }, { upsert: true, new: true })
    const totalShiftTime = UserShift.shift_Total
    const totalTimeOnline = humanizeDuration(totalShiftTime, {
      round: true,
    })
    const endEmbed = new EmbedBuilder()
          .setColor(0xFF6B35)
          .setTitle("Shift Management")
          .setDescription(
            `${interaction.user}, you can manage your shift below.`
          )
          .addFields(
            {
              name: "Current Status",
              value: `<:crab_offline:1350630808666374205> Off Duty`,
            },
            {
              name: "Time Online",
              value: `${totalTimeOnline}`,
            },
          );
          const Buttons = interaction.message.components
          const row = ActionRowBuilder.from(Buttons[0])
          const startButton = row.components[0]
          startButton.setDisabled(false)
          const newRow = new ActionRowBuilder().addComponents(startButton)
          interaction.update({ embeds: [endEmbed], components: [newRow] })
  }}
}
