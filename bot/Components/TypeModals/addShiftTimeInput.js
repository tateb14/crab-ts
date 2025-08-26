const { EmbedBuilder, MessageFlags, inlineCode } = require('discord.js');
const ms = require("ms");
const humanizeDuration = require("humanize-duration");
const ShiftLog = require('../../schemas/ShiftLog');
const UserShift = require('../../schemas/UserShift');

module.exports = {
  customIdPrefix: 'crab-modal_shift-add',
  execute: async (interaction) => {
    const [_, shiftId, messageId] = interaction.customId.split(":");

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const time = interaction.fields.getTextInputValue("crab-input_add-time");
    const addTime = ms(time);
    if (!addTime) {
      return interaction.editReply("❌ Invalid time format (e.g. `1h`, `30m`).");
    }

    const UserLog = await ShiftLog.findOneAndUpdate(
      { guildId: interaction.guild.id, shift_id: shiftId },
      { $inc: { shift_Time: addTime } },
      { new: true }
    );

    if (!UserLog) {
      return interaction.editReply("❌ Shift not found.");
    }

    await UserShift.findOneAndUpdate(
      { guildId: interaction.guild.id, shift_User: UserLog.shift_User },
      { $inc: { shift_Total: addTime } },
      { new: true }
    );

    const AddedTimeHumanized = humanizeDuration(addTime, { round: true });
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

    await interaction.editReply(`Added ${AddedTimeHumanized} to shift: ${inlineCode(UserLog.shift_id)}.`);
  }
};
