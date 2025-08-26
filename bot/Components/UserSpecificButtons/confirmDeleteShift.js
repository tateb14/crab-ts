const {
  ActionRowBuilder,
  EmbedBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  inlineCode,
  StringSelectMenuOptionBuilder
} = require("discord.js");
const ShiftLog = require("../../schemas/ShiftLog");
const humanizeDuration = require("humanize-duration")
module.exports = {
  customIdPrefix: "crab-button_shift-delete-confirm",
  execute: async (interaction, client) => {
    const [_, shiftId, messageId] = interaction.customId.split(":");
    const Shift = await ShiftLog.findOne({
      shift_id: shiftId,
      guildId: interaction.guild.id,
    });
    const userId = Shift.shift_User;
    await Shift.deleteOne({
      guildId: interaction.guild.id,
      shift_id: shiftId,
    });
    const UserLogs = await ShiftLog.find({
      shift_User: userId,
      guildId: interaction.guild.id,
    });
    const user = await interaction.guild.members.cache.get(userId)
    let message;
    try {
      message = await interaction.channel.messages.fetch(messageId);
    } catch {
      return interaction.editReply(
        "❌ Could not find the original shift panel message."
      );
    }
    if (!UserLogs || UserLogs.length === 0) {
      await message.edit({ content: "This user has no shifts.", embeds: [], components: [] });
      return interaction.update({
        content: "✅ Shift deleted. User has no more shifts.",
        components: [],
      });
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Displaying ${UserLogs.length} shifts for @${user.username}`,
        iconURL: user.displayAvatarURL(),
      })
      .setColor(0xec3935)
      .setFooter({
        text: `Requested by @${interaction.user.username} || Powered by Crab`,
      })
      .setTimestamp();

    const ShiftSelectMenu = new StringSelectMenuBuilder()
      .setCustomId(`crab-sm_shift-admin-options:${interaction.user.id}`)
      .setMaxValues(1)
      .setPlaceholder("Select a shift to manage");

    let counter = 1;
    for (const log of UserLogs) {
      const totalTimeOnline = humanizeDuration(log.shift_Time, { round: true });
      const totalBreakTime = humanizeDuration(log.shift_BreakTime, {
        round: true,
      });

      embed.addFields({
        name: `**${counter}:** ${inlineCode(log.shift_id)}`,
        value: `>>> **Shift Time:** ${totalTimeOnline}\n**Shift Break:** ${totalBreakTime}`,
      });

      ShiftSelectMenu.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(`${counter}: ${log.shift_id}`)
          .setDescription(totalTimeOnline)
          .setValue(log.shift_id)
      );

      counter++;
    }

    const row = new ActionRowBuilder().addComponents(ShiftSelectMenu);

    await message.edit({
      embeds: [embed],
      components: [row],
    });

    await interaction.update({
      content: "Action **confirmed**, I have deleted the shift.",
      components: [],
      ephemeral: true,
    });
  },
};
