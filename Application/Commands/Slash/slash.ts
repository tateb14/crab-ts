import { SlashCommandBuilder, MessageFlags, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, inlineCode, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChatInputCommandInteraction, GuildMember, AttachmentBuilder, User, Guild } from "discord.js";
import crabConfig from "../../Models/crab-config";
import userShift from "../../Models/user-shift";
import shiftLog from "../../Models/shift-log";
import * as humanizeDuration from "humanize-duration";
import { generateDatabaseIdString } from "../../Functions/randomId";
import capitalizeFirstLetter from "../../Functions/capitalize-first-letter";
import * as emojis from "../../../emojis.json";

export default {
    data: new SlashCommandBuilder()
        .setName("shift")
        .setDescription("..")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("manage")
                .setDescription("Manage your shift.")
                .addStringOption((option) => option.setName("type").setRequired(false).setDescription("Log your shift on a specific type if you wish!").addChoices({ name: "Patrol", value: "patrol" }, { name: "SWAT", value: "swat" }, { name: "Internal Affairs", value: "ia" }, { name: "Detective", value: "detective" }))
        )
        .addSubcommand((subcommand) => subcommand.setName("active").setDescription("List all active shifts."))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("admin")
                .setDescription("Manage a user's shift.")
                .addUserOption((user) => user.setName("user").setDescription("The user you want to manage."))
        )
        .addSubcommand((subcommand) => subcommand.setName("leaderboard").setDescription("View your server's leaderboard!")),
    execute: async (interaction: ChatInputCommandInteraction) => {
        //? Fetch the subcommand being ran
        const subcommand = interaction.options.getSubcommand();

        //? Global Checks
        const guild = interaction.guild as Guild;
        const member = interaction.member as GuildMember;
        const user = interaction.user as User;

        if (!guild || !member || !user) return;
        //? Fetch the guild configuration
        const guildConfig = await crabConfig.findOne({
            guildId: guild.id,
        });
        // ! Check guild config
        if (!guildConfig) {
            return interaction.reply({ content: `**@${user.username}**, no guild configuration was found. Please contact Tropical Systems.`, flags: MessageFlags.Ephemeral });
        }
        //? Fetch all role ids
        const personnelRoleId = guildConfig!.perms_PersonnelRole;
        const supervisorRoleId = guildConfig!.perms_SupervisorRole;
        const highCommRoleId = guildConfig!.perms_HiCommRole;
        const allAccessRoleId = guildConfig!.perms_AllAccessRole;
        if (!personnelRoleId || !supervisorRoleId || !highCommRoleId || !allAccessRoleId) {
            return interaction.reply({ content: `${emojis.x}, this server has not setup all permission roles.`, flags: MessageFlags.Ephemeral });
        }
        if (!member.roles.cache.hasAny(personnelRoleId, supervisorRoleId, highCommRoleId, allAccessRoleId)) {
            return interaction.reply({ content: `${emojis.x}, **@${user.username}**, you cannot use this command.`, flags: MessageFlags.Ephemeral });
        }

        // ? Define Embed Footer Banner
        const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
            name: "embed-footer-banner.png",
        });

        // * Subcommand manage data
        if (subcommand === "manage") {
            //? Fetch shfit type
            const shiftType = interaction.options.getString("type") || "default";
            //? Fetch userInfo
            let userInfo = await userShift.findOne({
                shift_User: user.id,
                guildId: guild.id,
            });
            //? If no user info exists, then make a new one.
            if (!userInfo) {
                const newShiftUser = new userShift({
                    guildId: guild.id,
                    shift_User: user.id,
                    shift_Type: shiftType,
                    shift_OnDuty: false,
                    shift_OnBreak: false,
                    shift_Total: 0,
                    shift_start: null,
                    shift_TotalBreakTime: 0,
                });
                await newShiftUser.save();
                userInfo = newShiftUser;
            }

            const onDuty = userInfo.shift_OnDuty === true;
            const onBreak = userInfo.shift_OnBreak;
            const totalShiftTime = userInfo.shift_Total || 0;
            const totalTimeOnline = humanizeDuration(totalShiftTime, {
                round: true,
            });

            // ? Message Constants
            const row = new ActionRowBuilder<ButtonBuilder>();
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `@${user.username}`,
                    iconURL: user.displayAvatarURL(),
                })
                .setColor(0xe9c46a)
                .setDescription(`${user}, you can manage your shift below.`)
                .setImage("attachment://embed-footer-banner.png");

            // * Message Buttons (used when needed)
            const startButton = new ButtonBuilder().setCustomId(`crab-buttons_start-shift:${user.id}`).setEmoji(emojis.clock_play).setLabel("Start Shift").setDisabled(true).setStyle(ButtonStyle.Success);
            const breakButton = new ButtonBuilder().setCustomId(`crab-buttons_shift-break:${user.id}`).setLabel("Toggle Break").setEmoji(emojis.clock_pause).setStyle(ButtonStyle.Secondary);
            const endButton = new ButtonBuilder().setCustomId(`crab-buttons_shift-end:${user.id}`).setLabel("End Shift").setEmoji(emojis.clock_stop).setStyle(ButtonStyle.Danger);

            if (onBreak === true) {
                embed.addFields(
                    {
                        name: "Current Status",
                        value: `${emojis.clock_pause} On Break`,
                    },
                    {
                        name: "Total Time Online",
                        value: `${totalTimeOnline}`,
                    },
                    {
                        name: "Shift Type",
                        value: `${capitalizeFirstLetter(shiftType)}`,
                    }
                );

                row.addComponents(startButton, breakButton, endButton);
            } else if (onDuty) {
                embed.addFields(
                    {
                        name: "Current Status",
                        value: `${emojis.clock_play} On Duty`,
                    },
                    {
                        name: "Time Online",
                        value: `${totalTimeOnline}`,
                    },
                    {
                        name: "Shift Type",
                        value: `${capitalizeFirstLetter(shiftType)}`,
                    }
                );
                row.addComponents(startButton, breakButton, endButton);
            } else {
                embed.addFields(
                    {
                        name: "Current Status",
                        value: `${emojis.clock_stop} Off Duty`,
                    },
                    {
                        name: "Time Online",
                        value: `${totalTimeOnline}`,
                    },
                    {
                        name: "Shift Type",
                        value: `${capitalizeFirstLetter(shiftType)}`,
                    }
                );

                row.addComponents(startButton);
            }

            await interaction.reply({ embeds: [embed], components: [row], files: [embedFooter] });
        } else if (subcommand === "active") {
            const onlineUsers = await userShift.find({
                guildId: guild.id,
                shift_OnDuty: true,
            });
            const embed = new EmbedBuilder().setTitle(`Displaying ${onlineUsers.length} Active Personnel`).setColor(0x2a9d8f).setImage("attachments://embed-banner-footer.png");

            const activeList = onlineUsers.map((user) => {
                const startTime = user.shift_start;
                if (!startTime) return null;
                const diff = Date.now() - startTime;
                return `- <@${user.shift_User}> | ${humanizeDuration(diff, { round: true })} | ${user.shift_OnBreak ? "**On Break**" : "**On Duty**"}`;
            }).filter(Boolean).join("\n");

            embed.setDescription(activeList.length > 0 ? activeList : "Currently no active personnel were found.");

            return interaction.reply({ embeds: [embed], files: [embedFooter] });
        } else if (subcommand === "admin") {
            if (!member.roles.cache.hasAny(highCommRoleId, allAccessRoleId)) {
                return interaction.reply({ content: `${emojis.x}, **@${user.username}**, you cannot use this command.`, flags: MessageFlags.Ephemeral });
            }
            const userInputted = interaction.options.getUser("user") || user;
            if (userInputted.id === user.id) {
                if (!member.roles.cache.has(allAccessRoleId)) {
                    return interaction.reply("You cannot edit your own shifts.");
                }
            }
            const userLogs = await shiftLog.find({
                shift_User: user.id,
                guildId: guild.id,
            });
            if (!userLogs || userLogs.length === 0) {
                return interaction.reply({ content: `${emojis.x} **@${user.username}**, @${userInputted.username} has not yet recorded any shifts.`, flags: MessageFlags.Ephemeral });
            }
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Displaying ${userLogs.length} for @${userInputted.username}`,
                    iconURL: userInputted.displayAvatarURL(),
                })
                .setColor(0xec3935)
                .setImage("attachment://embed-footer-banner.png")
                .setFooter({
                    text: `Requested by @${user.username} || Powered by Crab`,
                })
                .setTimestamp();
            const shiftSelectMenu = new StringSelectMenuBuilder().setCustomId(`crab-sm_shift-admin-options:${user.id}`).setMaxValues(1).setPlaceholder("Select an shift to manage");

            let counter = 1;
            for (const userLog of userLogs) {
                const totalTimeOnline = humanizeDuration(userLog.shift_Time, {
                    round: true,
                });
                const totalBreakTime = humanizeDuration(userLog.shift_BreakTime, {
                    round: true,
                });
                embed.addFields({
                    name: `**${counter}:** ${inlineCode(userLog.shift_id)}`,
                    value: `>>> **Shift Time:** ${totalTimeOnline}\n**Shift Break:** ${totalBreakTime}`,
                });
                shiftSelectMenu.addOptions(new StringSelectMenuOptionBuilder().setLabel(`${counter}: ${userLog.shift_id}`).setDescription(`${totalTimeOnline}`).setValue(`${userLog.shift_id}`));
                counter++;
            }
            const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(shiftSelectMenu);
            interaction.reply({
                embeds: [embed],
                components: [row],
                files: [embedFooter]
            });
        } else if (subcommand === "leaderboard") {
            const guildShifts = await userShift.find({
                guildId: guild.id,
            });
            guildShifts.sort((a, b) => (b.shift_Total || 0) - (a.shift_Total || 0));
            let leaderboardDescription = [];
            const embed = new EmbedBuilder().setColor(0xec3935).setTitle(`${guild.name} | Shift Leaderboard`).setFooter({ text: "Powered by Crab" }).setTimestamp().setImage("attachment://embed-footer-banner.png");

            if (guildShifts.length === 0) {
                const NoShifts = "No current shifts have been logged.";
                leaderboardDescription.push(NoShifts);
                embed.setDescription(leaderboardDescription.toString());
            }

            for (const guildShift of guildShifts) {
                const shiftUser = guildShift.shift_User;
                const shiftTotal = guildShift.shift_Total || 0;
                const humanizedTime = humanizeDuration(shiftTotal, {
                    round: true,
                });
                leaderboardDescription.push(`<@${shiftUser}> • ${humanizedTime}`);
                embed.setDescription(leaderboardDescription.join("\n"));
            }
            return interaction.reply({ embeds: [embed], files: [embedFooter] });
        }
    },
};
