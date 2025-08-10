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
              { name: "Patrol", value: "patrol-shift" },
              { name: "SWAT", value: "swat-shift" },
              { name: "Internal Affairs", value: "ia-shift" },
              { name: "Detective", value: "detective-shift" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("active").setDescription("List all active shifts.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("admin")
        .setDescription("Manage a user's shift.")
        .addUserOption((user) =>
          user
            .setName("user")
            .setDescription("The user you want to manage their shifts.")
            .setRequired(true)
        )
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
      !(interaction.member.roles.cache.has(staffRole) || interaction.member.roles.cache.has(SupervisorRole) || interaction.member.roles.cache.has(HiCommRole) || interaction.member.roles.cache.has(AARole))
    ) {
      return interaction.reply({
        content: "**Insufficient** permissions.",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      if (subcommand === "manage") {
        const shiftType = interaction.options.getString("type") || "Default";
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
        }

        if (departmentTypes.includes(shiftType) || shiftType === "Default") {
          const onDuty = userInfo.shift_OnDuty === true;
          const onBreak = userInfo.shift_OnBreak === true;
          const totalShiftTime = userInfo.shift_Total || 0;
          const totalTimeOnline = humanizeDuration(totalShiftTime, {
            round: true,
          });
          if (onBreak) {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: `@${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setColor(0xe9c46a)
              .setDescription(
                `${interaction.user}, you can manage your shift below.`
              )
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
                  value: `${shiftType}`,
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
              .setColor(0x2a9d8f)
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
                  value: `${shiftType}`,
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
              .setColor(0x572626)
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
                  value: `${shiftType}`,
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
        }
      } else if (subcommand === "active") {
        const OnlineUser = await UserShift.find({
          guildId: interaction.guild.id,
          shift_OnDuty: true,
          shift_OnBreak: false,
        });

        const BreakUser = await UserShift.find({
          guildId: interaction.guild.id,
          shift_OnBreak: true,
        });
        if (OnlineUser.length + BreakUser.length === 0) {
          const embed = new EmbedBuilder()
            .setTitle(`Displaying 0 Active Personnel`)
            .setColor(0x2a9d8f)
            .setDescription("Currently no active personnel were found.");

          return interaction.reply({ embeds: [embed] });
        }
        const onDutyEmbed = new EmbedBuilder()
          .setTitle(`Active Personnel (${OnlineUser.length})`)
          .setColor(0x2a9d8f);

        const onDutyList = OnlineUser.map(
          (user) => `- <@${user.shift_User}>`
        ).join("\n");

        onDutyEmbed.setDescription(
          onDutyList.length > 0 ? onDutyList : "No one is on duty!"
        );
        const onBreakEmbed = new EmbedBuilder()
          .setTitle(`Personnel On Break (${BreakUser.length})`)
          .setColor(0xe9c46a);

        const onBreakList = BreakUser.map(
          (user) => `- <@${user.shift_User}>`
        ).join("\n");

        onBreakEmbed.setDescription(
          onBreakList.length > 0 ? onBreakList : "No one is on break!"
        );

        return interaction.reply({ embeds: [onDutyEmbed, onBreakEmbed] });
      } else if (subcommand === "admin") {
        if (!interaction.member.roles.cache.has(HiCommRole) && !interaction.member.roles.cache.has(AARole)) {
          return interaction.reply({
            content: "**Insufficient** permissions.",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          const user = interaction.options.getUser("user");
          if (interaction.user.id === user.id) {
            if (!interaction.member.roles.cache.has(AARole)) {
              return interaction.reply("NO")
            }
          }
          const UserLogs = await ShiftLog.find({
            shift_User: user.id,
            guildId: interaction.guild.id,
          });
          if (!UserLogs || UserLogs.length === 0) {
            return interaction.reply("This user has no current shifts.")
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
            .setColor(0xfaf3e0)
            .setFooter({
              text: `Requested by @${interaction.user.username} || Powered by Crab`,
            })
            .setTimestamp();
          const ShiftSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("crab-sm_shift-admin-options")
            .setMaxValues(1)
            .setPlaceholder("Select an shift to manage");

          let counter = 1;
          for (const [ shift_id, shift_time, shift_BreakTime,] of UserLogMap.entries()) {
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
            flags: MessageFlags.Ephemeral,
            components: [row],
          });
        }
      }
    }
  },
};
