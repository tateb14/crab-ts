const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, inlineCode } = require('discord.js')
const ms = require("ms")
const humanizeDuration = require("humanize-duration")
const ShiftLog = require('../../schemas/ShiftLog')
const UserShift = require('../../schemas/UserShift')
module.exports = {
  customIdPrefix: 'crab-modal_shift-subtract',
  execute: async (interaction, client) => {
    const shiftId = interaction.customId.split(":")[1]
    await interaction.deferReply({ content: `Subtracting time from the shift...`, flags: MessageFlags.Ephemeral })
    const time = interaction.fields.getTextInputValue("crab-input_subtract-time")
    const subtractTime = ms(time)
    if (!subtractTime) {
     return interaction.editReply("Error message")
    }
    const UserLog = await ShiftLog.findOneAndUpdate(
      { guildId: interaction.guild.id, shift_id: shiftId },
      {
        $inc: { shift_Time: -subtractTime },
      },
      { new: true })
      await UserShift.findOneAndUpdate(
        { guildId: interaction.guild.id, shift_User: UserLog.shift_User },
        {
          $inc: { shift_Total: -subtractTime },
        },
        { new: true })
    const SubtractedTimeHumanized = humanizeDuration(subtractTime, {
      round: true
    })
    interaction.editReply({ content: `Subtracted ${SubtractedTimeHumanized} to shift: ${inlineCode(UserLog.shift_id)}.`, flags: MessageFlags.Ephemeral })
    if (!UserLog){
      return interaction.editReply('Error message2')
    }

  }
}
