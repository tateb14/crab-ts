const {
  EmbedBuilder,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const CrabShifts = require("../../schemas/UserShift");
const humanizeDuration = require('humanize-duration')
const responses = require("../../Functions/responses")
module.exports = {
  customIdPrefix: "crab-buttons_shift-break",
  execute: async (interaction, client) => {
    const userId = interaction.customId.split(":")[1];
    const guildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id })
    const OnBreakRole = guildConfig.shift_OnBreak
    const OnDutyRole = guildConfig.shift_OnDuty
    const onDutyRoleObj = interaction.guild.roles.cache.get(OnDutyRole);
    const OnBreakRoleObj = interaction.guild.roles.cache.get(OnBreakRole);
    const botMember = await interaction.guild.members.fetch(client.user.id);
    const BotRole = botMember.roles.highest;
    if (interaction.user.id !== userId) {
      await interaction.update({});
      return interaction.followUp(responses.errors.unauthorizedUser)
    }
      const UserShift = await CrabShifts.findOne({
        guildId: interaction.guild.id,
        shift_User: interaction.user.id,
      });
      const onBreak = UserShift.shift_OnBreak;

      if (onBreak === false) {
        const totalShiftTime = UserShift.shift_Total || 0
        const totalTimeOnline = humanizeDuration(totalShiftTime, {
          round: true,
        })
        const breakStartTime = Date.now();
        const discordStartTime = Math.floor(Date.now() / 1000);
        const breakEmbed = new EmbedBuilder()
          .setColor(0xE9C46A)
          .setTitle("Shift Management")
          .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
          .setDescription(
            `${interaction.user}, you can manage your shift below.`
          )
          .addFields(
            {
              name: "Current Status",
              value: `<:crab_break:1350630809580732569> On Break`,
            },
            {
              name: "Current Shift Time Online",
              value: `${totalTimeOnline}`,
            },
            {
              name: "Break Started",
              value: `<t:${discordStartTime}:R>`,
            }
          );
          await UserShift.updateOne({ shift_startBreak: breakStartTime }, { upsert: true, new: true })
          await UserShift.updateOne({ shift_OnBreak: true }, { upsert: true, new: true })
          await UserShift.updateOne({ shift_OnDuty: true }, { upsert: true, new: true })
          const Buttons = interaction.message.components
          const row = ActionRowBuilder.from(Buttons[0])
          if (interaction.guild.roles.cache.has(OnBreakRole)) {
            if (BotRole.position <= onDutyRoleObj.position || BotRole.position <= OnBreakRoleObj.position) {
              return interaction.reply({ content: `I cannot assign roles to this user. Please edit my role position to be above the <@&${OnDutyRole}> and/or <@&${OnBreakRole}> role.`, flags: MessageFlags.Ephemeral })
            }
            try {
              if (!interaction.member.roles.cache.has(OnBreakRole)){
              interaction.member.roles.add(OnBreakRole)
              interaction.member.roles.remove(OnDutyRole)
              }
            } catch (error) {
              console.error(error)
            }
          }
          interaction.update({ embeds: [breakEmbed], components: [row] })
      } else {
        const totalShiftTime = UserShift.shift_Total
        const totalTimeOnline = humanizeDuration(totalShiftTime, {
          round: true,
        })
        const endTime = Date.now()
      const discordStartTime = Math.floor((Date.now()) / 1000);
      const breakEndEmbed = new EmbedBuilder()
      .setColor(0x2A9D8F)
      .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
      .setTitle('Shift Management')
      .setDescription(`${interaction.user}, you can manage your shift below.`)
      .addFields(
        {
          name: 'Current Status',
          value: `<:crab_online:1350630807022207017> On Duty`
        },
        {
          name: 'Current Shift Time Online',
          value: `${totalTimeOnline}`
        },
        {
          name: 'Shift Contiuned Since',
          value: `<t:${discordStartTime}:R>`
        }
      )
      const startTime = UserShift.shift_startBreak
      const totalBreakTime = endTime - startTime
      await UserShift.updateOne({ shift_endBreak: endTime }, { upsert: true, new: true })
      await UserShift.updateOne({ $inc: { shift_TotalBreakTime: +totalBreakTime } }, { upsert: true, new: true })
      await UserShift.updateOne({ shift_OnBreak: false}, { upsert: true, new: true })
      await UserShift.updateOne({ shift_OnDuty: true}, { upsert: true, new: true })
      const Buttons = interaction.message.components
      const row = ActionRowBuilder.from(Buttons[0])
      if (interaction.guild.roles.cache.has(OnBreakRole)) {
        if (BotRole.position <= onDutyRoleObj.position || BotRole.position <= OnBreakRoleObj.position) {
          return interaction.reply({ content: `I cannot assign roles to this user. Please edit my role position to be above the <@&${OnDutyRole}> and/or <@&${OnBreakRole}> role.`, flags: MessageFlags.Ephemeral })
        }
        try {
          if (interaction.member.roles.cache.has(OnBreakRole)){
          interaction.member.roles.remove(OnBreakRole)
          interaction.member.roles.add(OnDutyRole)
          }
        } catch (error) {
          console.error(error)
        }
      }
      interaction.update({ embeds: [breakEndEmbed], components: [row] })
    }
  }
};
