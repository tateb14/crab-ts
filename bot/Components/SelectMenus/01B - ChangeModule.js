const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags } = require('discord.js')
const CrabConfig = require("../../schemas/CrabConfig")
const { officer, fire_truck, traffic_light } = require("../../../emojis.json")
module.exports = {
  customId: 'crab-sm_change',
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
        .setColor("#b81e37")
        .setTitle("Configure Crab")
        .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
        .setDescription(
          `**Crab** is an easy to use management bot for your department! We allow our users to easily customize **Crab** to ensure the most flexibility with all situations!\n\nTo begin, you will need to set the type of department you are using **Crab** for:\n- **Configure Department Type**: Select one of the options (Law Enforcement, Fire and Medical, and Department of Transportation.)\n-# You can change the department type in the next step if needed.`
        );

      const departmentSelectionMenu = new StringSelectMenuBuilder()
        .setCustomId("crab-sm_department-selection")
        .setPlaceholder("Configure Department Types")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setEmoji(officer)
            .setLabel("Law Enforcement")
            .setValue("crab-sm_le"),
          new StringSelectMenuOptionBuilder()
            .setEmoji(fire_truck)
            .setLabel("Fire and Medical")
            .setValue("crab-sm_fd-med"),
          new StringSelectMenuOptionBuilder()
            .setEmoji(traffic_light)
            .setLabel("Department of Transportation")
            .setValue("crab-sm_dot")
        );

      const departmentSelectionRow = new ActionRowBuilder().addComponents(
        departmentSelectionMenu
      );
      await CrabConfig.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $set: { crab_DepartmentType: null } },
        { upsert: true, new: true }
      )
      interaction.update({
        embeds: [embed],
        components: [departmentSelectionRow],
        flags: MessageFlags.Ephemeral,
      });
  }
}
