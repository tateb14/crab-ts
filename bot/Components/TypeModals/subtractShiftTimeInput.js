const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, inlineCode } = require('discord.js')
const ms = require("ms")
const humanizeDuration = require("humanize-duration")
const ShiftLog = require('../../schemas/ShiftLog')
const UserShift = require('../../schemas/UserShift')
module.exports = {
  customIdPrefix: 'crab-modal_shift-subtract',
  execute: async (interaction, client) => {
    const [_, shiftId, messageId] = interaction.customId.split(":");
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
    let message;
    try {
      message = await interaction.channel.messages.fetch(messageId);
    } catch {
      return interaction.editReply("❌ Could not find the original shift panel message.");
    }
    const embed = new EmbedBuilder()
          .setTitle(`${shiftId} Management Panel`)
          .setColor(0xec3935)
          .setTimestamp()
          .setFooter({ text: `Shift Management | Powered by Crab` })
          .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
          .addFields(
            { name: "Shift User:", value: `<@${UserLog.shift_User}>` },
            { name: "Total Shift Time:", value: humanizeDuration(UserLog.shift_Time, { round: true }) },
            { name: "Total Break Time:", value: humanizeDuration(UserLog.shift_BreakTime, { round: true }) },
          );
    
        await message.edit({ embeds: [embed] });
    interaction.editReply({ content: `Subtracted ${SubtractedTimeHumanized} to shift: ${inlineCode(UserLog.shift_id)}.`, flags: MessageFlags.Ephemeral })
    if (!UserLog){
      return interaction.editReply('Error message2')
    }

  }
}
