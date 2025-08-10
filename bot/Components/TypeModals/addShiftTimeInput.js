const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, inlineCode } = require('discord.js')
const ms = require("ms")
const humanizeDuration = require("humanize-duration")
const ShiftLog = require('../../schemas/ShiftLog')
const UserShift = require('../../schemas/UserShift')
module.exports = {
  customIdPrefix: 'crab-modal_shift-add',
  execute: async (interaction, client) => {
    const shiftId = interaction.customId.split(":")[1]
    await interaction.deferReply({ content: `Adding time to the shift...`, flags: MessageFlags.Ephemeral })
    const time = interaction.fields.getTextInputValue("crab-input_add-time")
    const addTime = ms(time)
    if (!addTime) {
     return interaction.editReply("Error message")
    }
    const UserLog = await ShiftLog.findOneAndUpdate(
      { guildId: interaction.guild.id, shift_id: shiftId },
      {
        $inc: { shift_Time: addTime },
      },
      { new: true })
      await UserShift.findOneAndUpdate(
        { guildId: interaction.guild.id, shift_User: UserLog.shift_User },
        {
          $inc: { shift_Total: addTime },
        },
        { new: true })
    const AddedTimeHumanized = humanizeDuration(addTime, {
      round: true
    })
    interaction.editReply({ content: `Added ${AddedTimeHumanized} to shift: ${inlineCode(UserLog.shift_id)}.`, flags: MessageFlags.Ephemeral })
    if (!UserLog){
      return interaction.editReply('Error message2')
    }

  }
}
