import { EmbedBuilder, MessageFlags, ModalSubmitInteraction, inlineCode } from "discord.js"
import ms from "ms"
import humanizeDuration from "humanize-duration"
import shiftLog from "../../Models/shift-log"
import userShift from "../../Models/user-shift"
import { emojis } from '../../config'

export default {
  customIdPrefix: "crab-modal_shift-subtract",
  execute: async (interaction: ModalSubmitInteraction) => {
    const [_, shiftId, messageId] = interaction.customId.split(":");

    await interaction.deferReply();

    const time = Number(interaction.fields.getTextInputValue("crab-input_subtract-time"))
    const subtractTime = Number(ms(time));
    if (!subtractTime) {
      return interaction.editReply(`${emojis.x} Invalid time format (e.g. "1h", "30m").`);
    }

    const userLog = await shiftLog.findOneAndUpdate(
      { guildId: interaction.guild!.id, shift_id: shiftId },
      { $inc: { shift_Time: -subtractTime } },
      { new: true }
    );

    if (!userLog) {
      return interaction.editReply(`${emojis.x} Shift not found.`);
    }

    await userShift.findOneAndUpdate(
      { guildId: interaction.guild!.id, shift_User: userLog.shift_User },
      { $inc: { shift_Total: -subtractTime } },
      { new: true }
    );

    const subtractedTimeHumanized = humanizeDuration(subtractTime, { round: true });
    let message;
    try {
      message = await interaction.channel!.messages.fetch(messageId);
    } catch {
      return interaction.editReply(`${emojis.x} Could not find the original shift panel message.`);
    }
    const embed = new EmbedBuilder()
      .setTitle(`${shiftId} Management Panel`)
      .setColor(0xec3935)
      .setTimestamp()
      .setFooter({ text: `Shift Management | Powered by Crab` })
      .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
      .addFields(
        { name: "Shift User:", value: `<@${userLog.shift_User}>` },
        { name: "Total Shift Time:", value: humanizeDuration(userLog.shift_Time, { round: true }) },
        { name: "Total Break Time:", value: humanizeDuration(userLog.shift_BreakTime, { round: true }) },
      );

    await message.edit({ embeds: [embed] });

    await interaction.editReply(`Subtracted ${subtractedTimeHumanized} from shift: ${inlineCode(userLog.shift_id)}.`);
  }
};
