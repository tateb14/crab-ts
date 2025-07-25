const { ActionRowBuilder, EmbedBuilder, MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
const CrabShifts = require('../../schemas/UserShift')
const humanizeDuration = require('humanize-duration')
module.exports = {
  customIdPrefix: 'crab-buttons_shift-end',
  execute: async (interaction, client) => {
    const userId = interaction.customId.split(":")[1]
    const guildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id })
    const OnDutyRole = guildConfig.shift_OnDuty
    const OnBreakRole = guildConfig.shift_OnBreak
    if (interaction.user.id !== userId) {
      await interaction.update({})
      await interaction.followUp({ content: 'You **cannot** interact with this button.', flags: MessageFlags.Ephemeral })
    } else {
      const UserShift = await CrabShifts.findOne({
        guildId: interaction.guild.id,
        shift_User: interaction.user.id,
      });
      
      const endTime = Date.now();
      const startTime = UserShift.shift_start || endTime;
      const totalNBTime = endTime - startTime;
      const totalShiftBreakTime = (UserShift.shift_endBreak || endTime) - (UserShift.shift_startBreak || endTime);
      const totalTime = totalNBTime - totalShiftBreakTime;
      
      const updatedShift = await CrabShifts.findOneAndUpdate(
        { guildId: interaction.guild.id, shift_User: interaction.user.id },
        {
          $inc: { shift_Total: totalTime },
          $set: {
            shift_OnDuty: false,
            shift_OnBreak: false,
            shift_endBreak: null,
            shift_startBreak: null,
            shift_start: null,
          },
        },
        { new: true }
      );
      
      const totalTimeOnline = humanizeDuration(updatedShift.shift_Total || 0, {
        round: true,
      });    
    const endEmbed = new EmbedBuilder()
          .setColor(0x572626)
          .setTitle("Shift Management")
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
          );
          const Buttons = interaction.message.components
          const row = ActionRowBuilder.from(Buttons[0])
          const startButton = row.components[0]
          startButton.setDisabled(false)
          const newRow = new ActionRowBuilder().addComponents(startButton)
          if (interaction.guild.roles.cache.has(OnDutyRole) && interaction.guild.roles.cache.has(OnBreakRole)) {
            try {
              if (interaction.member.roles.cache.has(OnDutyRole) || interaction.member.roles.cache.has(OnBreakRole)){
              interaction.member.roles.remove(OnDutyRole)
              interaction.member.roles.remove(OnBreakRole)
              }
            } catch (error) {
              console.error(error)
            }
          }
          interaction.update({ embeds: [endEmbed], components: [newRow] })
  }}
}
