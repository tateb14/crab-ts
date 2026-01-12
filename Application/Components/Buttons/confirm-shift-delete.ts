import { ActionRowBuilder, EmbedBuilder, MessageFlags, StringSelectMenuBuilder, inlineCode, StringSelectMenuOptionBuilder, ButtonInteraction, Client, Guild, User, GuildMember } from "discord.js";
import shiftLog from "../../Models/shift-log";
import * as humanizeDuration from "humanize-duration";
import * as emojis from "../../../emojis.json";
export default {
    customId: "crab-button_shift-delete-confirm",
    execute: async (interaction: ButtonInteraction, client: Client) => {
        const [_, shiftId, messageId] = interaction.customId.split(":");

        const guild = interaction.guild as Guild;
        const user = interaction.user as User;
        if (!guild || !user) return;

        const shift = await shiftLog.findOne({
            shift_id: shiftId,
            guildId: guild.id,
        });
        if (!shift) return interaction.reply(`${emojis.x} **@${user.username}**, I could not find this shift log, please contact Tropical Systems.`);

        const userId = shift.shift_User;
        await shift.deleteOne({
            guildId: guild.id,
            shift_id: shiftId,
        });
        const userLogs = await shiftLog.find({
            shift_User: userId,
            guildId: guild.id,
        });
        let fetchedUser = (await guild.members.cache.get(userId)?.user) as User;

        if (!fetchedUser) return interaction.reply(`${emojis.x} **@${user.username}**, this user might not be a server. If this is a mistake, please contact Tropical Systems.`);
        let message;
        try {
            message = await interaction.channel!.messages.fetch(messageId);
        } catch {
            return interaction.editReply(`${emojis.x} Could not find the original shift panel message.`);
        }
        if (!userLogs || userLogs.length === 0) {
            await message.edit({ content: `${emojis.x} **@${user.username}, this user has no shifts.`, embeds: [], components: [] });
            return interaction.update({
                content: `${emojis.check} Action **canceled**, the user has no shifts recorded.`,
                components: [],
            });
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `Displaying ${userLogs.length} shifts for @${fetchedUser.username}`,
                iconURL: user.displayAvatarURL(),
            })
            .setColor(0xec3935)
            .setFooter({
                text: `Requested by @${user.username} || Powered by Crab`,
            })
            .setTimestamp();

        const shiftSelectMenu = new StringSelectMenuBuilder().setCustomId(`crab-sm_shift-admin-options:${user.id}`).setMaxValues(1).setPlaceholder("Select a shift to manage");

        let counter = 1;
        for (const log of userLogs) {
            const totalTimeOnline = humanizeDuration(log.shift_Time, { round: true });
            const totalBreakTime = humanizeDuration(log.shift_BreakTime, {
                round: true,
            });

            embed.addFields({
                name: `**${counter}:** ${inlineCode(log.shift_id)}`,
                value: `>>> **Shift Time:** ${totalTimeOnline}\n**Shift Break:** ${totalBreakTime}`,
            });

            shiftSelectMenu.addOptions(new StringSelectMenuOptionBuilder().setLabel(`${counter}: ${log.shift_id}`).setDescription(totalTimeOnline).setValue(log.shift_id));

            counter++;
        }

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(shiftSelectMenu);

        await message.edit({
            embeds: [embed],
            components: [row],
        });

        await interaction.update({ content: `${emojis.check} Action **confirmed**, I have deleted the shift.`, components: [] });
    },
};
