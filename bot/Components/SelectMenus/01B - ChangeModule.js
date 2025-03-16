const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags } = require('discord.js')
const CrabConfig = require("../../schemas/CrabConfig")
module.exports = {
  customId: 'crab-sm_change',
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
        .setColor("#b81e37")
        .setTitle("Configure Crab")
        .setDescription(
          `**Crab** is an easy to use management bot for your department! We allow our users to easily customize **Crab** to ensure the most flexibility with all situations!\n\nTo begin, you will need to set the type of department you are using **Crab** for:\n- **Configure Department Type**: Select one of the options (Law Enforcement, Fire and Medical, and Department of Transportation.)\n-# You can change the department type in the next step if needed.`
        );

      const departmentSelectionMenu = new StringSelectMenuBuilder()
        .setCustomId("crab-sm_department-selection")
        .setPlaceholder("Configure Department Types")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setEmoji("<:crab_officer:1349197478720831599>")
            .setLabel("Law Enforcement")
            .setValue("crab-sm_le"),
          new StringSelectMenuOptionBuilder()
            .setEmoji("<:crab_firetruck:1349197479664685168>")
            .setLabel("Fire and Medical")
            .setValue("crab-sm_fd-med"),
          new StringSelectMenuOptionBuilder()
            .setEmoji("<:crab_traffic_light:1349197475310866534> ")
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
