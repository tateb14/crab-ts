const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  inlineCode,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const UserShift = require("../../schemas/UserShift");
const ShiftLog = require("../../schemas/ShiftLog");
const humanizeDuration = require("humanize-duration");
const randomString = require("../../Functions/randomId");
const capitalizeFirstLetter = require("../../Functions/capitalizeFirstLetter");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("shift")
    .setDescription("..")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("manage")
        .setDescription("Manage your shift.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setRequired(false)
            .setDescription("Log your shift on a specific type if you wish!")
            .addChoices(
              { name: "Patrol", value: "patrol" },
              { name: "SWAT", value: "swat" },
              { name: "Internal Affairs", value: "ia" },
              { name: "Detective", value: "detective" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("active").setDescription("List all active shifts.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("admin").setDescription("Manage a user's shift.").addUserOption(user => user
        .setName("user")
        .setDescription("The user you want to manage.")
      )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leaderboard")
        .setDescription("View your server's leaderboard!")
    ),
  execute: async (interaction) => {
    const subcommand = interaction.options.getSubcommand();
    const guildConfig = await CrabConfig.findOne({
      guildId: interaction.guild.id,
    });
    const staffRole = guildConfig.perms_PersonnelRole;
    const HiCommRole = guildConfig.perms_HiCommRole;
    const SupervisorRole = guildConfig.perms_SupervisorRole;
    const AARole = guildConfig.perms_AllAccessRole;
    if (
      !(
        interaction.member.roles.cache.has(staffRole) ||
        interaction.member.roles.cache.has(SupervisorRole) ||
        interaction.member.roles.cache.has(HiCommRole) ||
        interaction.member.roles.cache.has(AARole)
      )
    ) {
      return interaction.reply({
        content: "**Insufficient** permissions.",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      if (subcommand === "manage") {
        const shiftType = interaction.options.getString("type") || "default";
        const departmentTypes = guildConfig.shift_Types;
        let userInfo = await UserShift.findOne({
          shift_User: interaction.user.id,
          guildId: interaction.guild.id,
        });

        if (!userInfo) {
          const newShiftUser = new UserShift({
            guildId: interaction.guild.id,
            shift_User: interaction.user.id,
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
        if (shiftType !== "default") {
        if (!departmentTypes.includes(shiftType)) {
          return interaction.reply({ content: `<:crab_x:1409708189896671357> The shift type you selected, ${inlineCode(capitalizeFirstLetter(shiftType))}, is not an approved shift in this department.` })
        }
      }
          const onDuty = userInfo.shift_OnDuty === true;
          const onBreak = userInfo.shift_OnBreak;
          const totalShiftTime = userInfo.shift_Total || 0;
          const totalTimeOnline = humanizeDuration(totalShiftTime, {
            round: true,
          });
          if (onBreak === true) {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: `@${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setColor(0xE9C46A)
              .setDescription(
                `${interaction.user}, you can manage your shift below.`
              )
              .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
              .addFields(
                {
                  name: "Current Status",
                  value: `<:crab_break:1350630809580732569> On Break`,
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
            const startButton = new ButtonBuilder()
              .setCustomId(`crab-buttons_start-shift:${interaction.user.id}`)
              .setEmoji("<:crab_clock_play:1350635274857611375>")
              .setLabel("Start Shift")
              .setDisabled(true)
              .setStyle(ButtonStyle.Success);
            const BreakButton = new ButtonBuilder()
              .setCustomId(`crab-buttons_shift-break:${interaction.user.id}`)
              .setLabel("Toggle Break")
              .setEmoji("<:crab_clock_pause:1350701435116847216>")
              .setStyle(ButtonStyle.Secondary);
            const EndButton = new ButtonBuilder()
              .setCustomId(`crab-buttons_shift-end:${interaction.user.id}`)
              .setLabel("End Shift")
              .setEmoji("<:crab_clock_stop:1350701433980325979>")
              .setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder().addComponents(
              startButton,
              BreakButton,
              EndButton
            );
            interaction.reply({ embeds: [embed], components: [row] });
          } else if (onDuty) {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: `@${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setColor(0xec3935)
              .setDescription(
                `${interaction.user}, you can manage your shift below.`
              )
              .addFields(
                {
                  name: "Current Status",
                  value: `<:crab_online:1350630807022207017> On Duty`,
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
            const startButton = new ButtonBuilder()
              .setCustomId(`crab-buttons_start-shift:${interaction.user.id}`)
              .setEmoji("<:crab_clock_play:1350635274857611375>")
              .setLabel("Start Shift")
              .setDisabled(true)
              .setStyle(ButtonStyle.Success);
            const BreakButton = new ButtonBuilder()
              .setCustomId(`crab-buttons_shift-break:${interaction.user.id}`)
              .setLabel("Toggle Break")
              .setEmoji("<:crab_clock_pause:1350701435116847216>")
              .setStyle(ButtonStyle.Secondary);
            const EndButton = new ButtonBuilder()
              .setCustomId(`crab-buttons_shift-end:${interaction.user.id}`)
              .setLabel("End Shift")
              .setEmoji("<:crab_clock_stop:1350701433980325979>")
              .setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder().addComponents(
              startButton,
              BreakButton,
              EndButton
            );
            interaction.reply({ embeds: [embed], components: [row] });
          } else {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: `@${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setColor(0xec3935)
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
                {
                  name: "Shift Type",
                  value: `${capitalizeFirstLetter(shiftType)}`,
                }
              );
            const startButton = new ButtonBuilder()
              .setCustomId(`crab-buttons_start-shift:${interaction.user.id}`)
              .setEmoji("<:crab_clock_play:1350635274857611375>")
              .setLabel("Start Shift")
              .setStyle(ButtonStyle.Success);
            const row = new ActionRowBuilder().addComponents(startButton);
            interaction.reply({ embeds: [embed], components: [row] });
          }
      } else if (subcommand === "active") {
        const OnlineUser = await UserShift.find({
          guildId: interaction.guild.id,
          shift_OnDuty: true,
        });
        if (OnlineUser.length === 0) {
          const embed = new EmbedBuilder()
            .setTitle(`Displaying 0 Active Personnel`)
            .setColor(0x2a9d8f)
            .setDescription("Currently no active personnel were found.");
            

          return interaction.reply({ embeds: [embed] });
        }
        const onDutyEmbed = new EmbedBuilder()
          .setTitle(`Active Personnel (${OnlineUser.length})`)
          .setColor(0x2a9d8f)
          .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&");

        const activeList = OnlineUser.map((user) => {
            const startTime = user.shift_start
            if(!startTime) return null;
            const diff = Date.now() - startTime;
            return `- <@${user.shift_User}> | ${humanizeDuration(diff, { round: true })} | ${user.shift_OnBreak ? "**On Break**" : "**On Duty**"}`}).filter(Boolean).join("\n")

        onDutyEmbed.setDescription(
          activeList.length > 0 ? activeList : "No one is on duty!"
        );
        // const onBreakEmbed = new EmbedBuilder()
        //   .setTitle(`Personnel On Break (${BreakUser.length})`)
        //   .setColor(0xe9c46a)
        //   .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")

        // const onBreakList = BreakUser.map(
        //   (user) => `- <@${user.shift_User}>`
        // ).join("\n");

        // onBreakEmbed.setDescription(
        //   onBreakList.length > 0 ? onBreakList : "No one is on break!"
        // );

        return interaction.reply({ embeds: [onDutyEmbed] });
      } else if (subcommand === "admin") {
        if (
          !interaction.member.roles.cache.has(HiCommRole) &&
          !interaction.member.roles.cache.has(AARole)
        ) {
          return interaction.reply({
            content: "**Insufficient** permissions.",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          const user = interaction.options.getUser("user") || interaction.user
          if (interaction.user.id === user.id) {
            if (!interaction.member.roles.cache.has(AARole)) {
              return interaction.reply("You cannot edit your own shifts.");
            }
          }
          const UserLogs = await ShiftLog.find({
            shift_User: user.id,
            guildId: interaction.guild.id,
          });
          if (!UserLogs || UserLogs.length === 0) {
            return interaction.reply("This user has no shifts.");
          }
          const UserLogMap = new Map();
          for (const log of UserLogs) {
            UserLogMap.set(log.shift_id, log.shift_Time, log.shift_BreakTime);
          }
          const embed = new EmbedBuilder()
            .setAuthor({
              name: `Displaying ${UserLogs.length} for @${user.username}`,
              iconURL: user.displayAvatarURL(),
            })
            .setColor(0xec3935)
            .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
            .setFooter({
              text: `Requested by @${interaction.user.username} || Powered by Crab`,
            })
            .setTimestamp();
          const ShiftSelectMenu = new StringSelectMenuBuilder()
            .setCustomId(`crab-sm_shift-admin-options:${interaction.user.id}`)
            .setMaxValues(1)
            .setPlaceholder("Select an shift to manage");

          let counter = 1;
          for (const [
            shift_id,
            shift_time,
            shift_BreakTime,
          ] of UserLogMap.entries()) {
            const totalTimeOnline = humanizeDuration(shift_time, {
              round: true,
            });
            const totalBreakTime = humanizeDuration(shift_BreakTime, {
              round: true,
            });
            embed.addFields({
              name: `**${counter}:** ${inlineCode(shift_id)}`,
              value: `>>> **Shift Time:** ${totalTimeOnline}\n**Shift Break:** ${totalBreakTime}`,
            });
            ShiftSelectMenu.addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel(`${counter}: ${shift_id}`)
                .setDescription(`${totalTimeOnline}`)
                .setValue(`${shift_id}`)
            );
            counter++;
          }
          const row = new ActionRowBuilder().addComponents(ShiftSelectMenu);
          interaction.reply({
            embeds: [embed],
            components: [row],
          });
        }
      } else if (subcommand === "leaderboard") {
        try {
          const GuildShifts = await UserShift.find({
            guildId: interaction.guild.id,
          });
          let LeaderboardDescription = [];
          const embed = new EmbedBuilder()
            .setColor(0xec3935)
            .setTitle(`${interaction.guild.name} | Shift Leaderboard`)
            .setFooter({ text: "Powered by Crab" })
            .setTimestamp()
            .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&");

          if (GuildShifts.length === 0) {
            const NoShifts = "No current shifts have been logged.";
            LeaderboardDescription.push(NoShifts);
            embed.setDescription(LeaderboardDescription.toString());
          }

          for (const Shift of GuildShifts) {
            const ShiftUser = Shift.shift_User;
            const ShiftTotal = Shift.shift_Total || "0 seconds";
            const humanizedTime = humanizeDuration(ShiftTotal, {
              round: true,
            });
            LeaderboardDescription.push(`<@${ShiftUser}> • ${humanizedTime}`);
            embed.setDescription(LeaderboardDescription.join("\n"));
          }
          return interaction.reply({ embeds: [embed] });
        } catch (error) {
          console.error(error);
        }
      }
    }
  },
};
