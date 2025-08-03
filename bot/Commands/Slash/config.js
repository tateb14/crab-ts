const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  MessageFlags,
  inlineCode
} = require("discord.js");
const crabConfig = require("../../schemas/CrabConfig.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure Crab's behavior for your server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  execute: async (interaction) => {
    const GuildConfig = await crabConfig.findOne({ guildId: interaction.guild.id })
    const GuildPrefix = GuildConfig.crab_Prefix || '-'
    if (!GuildConfig) {
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
      interaction.reply({
        embeds: [embed],
        components: [departmentSelectionRow],
        flags: MessageFlags.Ephemeral,
      });
    } else {
      const departmentType = GuildConfig.crab_DepartmentType;

      if (departmentType === "leo") {
        const embed = new EmbedBuilder()
          .setColor("#b81e37")
          .setTitle("Configure Crab")
          .setDescription(
            `You have selected the **Law Enforcement** department type.\n\nNow, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n* **<:crab_lock_pass:1349197473339670559> Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **<:crab_message:1399409507062382764> Configure Prefix**\n  * Change Crab's prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(GuildPrefix)}\n* **<:crab_clock:1349595336389427221> Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n* **<:crab_clipboard:1349595335378337833> Record Management**\n  * Seamlessly record your arrests, citations, and traffic warnings using our record management system.\n* **<:crab_flag:1349595334463979550> Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n* **<:crab_trending_up:1349595567763751012> Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **<:crab_repeat:1349598027236769822> Change Module**\n  * Switch the module from **Law Enforcement** to **Fire and Medical** or **Department of Transportation** easily!`
          );

        const leoSelect = new StringSelectMenuBuilder()
          .setCustomId("crab-sm_le-plugins")
          .setPlaceholder("Configure Law Enforcement Plugins")
          .setOptions(
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_lock_pass:1349197473339670559>")
              .setLabel("Configure Permissions")
              .setValue("crab-sm_perms"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_clock:1349595336389427221>")
              .setLabel("Shift Logging")
              .setValue("crab-sm_shifts"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_clipboard:1349595335378337833>")
              .setLabel("Record Management")
              .setValue("crab-sm_records"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_flag:1349595334463979550>")
              .setLabel("Reports")
              .setValue("crab-sm_reports"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_trending_up:1349595567763751012>")
              .setLabel("Promotions, Infractions, and Demotions")
              .setValue("crab-sm_staff"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_repeat:1349598027236769822>")
              .setLabel("Change Module")
              .setValue("crab-sm_change")
          );
        const row = new ActionRowBuilder().addComponents(leoSelect);
        interaction.reply({
          embeds: [embed],
          components: [row],
          flags: MessageFlags.Ephemeral
        });
      } else if (departmentType === 'fd-med') {
        const embed = new EmbedBuilder()
          .setColor("#b81e37")
          .setTitle("Configure Crab")
          .setDescription(`You have selected the **Fire and Medical** department type.\n\nNow, you will configure the modules for the **Fire and Medical** commands. The **Fire and Medical** type will allow the following modules to be used:\n* **<:crab_lock_pass:1349197473339670559> Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **<:crab_message:1399409507062382764> Configure Prefix**\n  * Change Crab's prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(GuildPrefix)}\n* **<:crab_clock:1349595336389427221> Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n* **<:crab_flag:1349595334463979550> Reports**\n  * Easily log your reports like: inspection reports, fire reports, medical reports, and more!\n* **<:crab_trending_up:1349595567763751012> Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **<:crab_repeat:1349598027236769822> Change Module**\n  * Switch the module from **Fire and Medical** to **Law Enforcement** or **Department of Transportation** easily!`)

        const fdMedSelect = new StringSelectMenuBuilder()
          .setCustomId("crab-sm_fd-med-plugins")
          .setPlaceholder("Configure Fire and Medical Plugins")
          .setOptions(
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_lock_pass:1349197473339670559>")
              .setLabel("Configure Permissions")
              .setValue("crab-sm_perms"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_clock:1349595336389427221>")
              .setLabel("Shift Logging")
              .setValue("crab-sm_shifts"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_flag:1349595334463979550>")
              .setLabel("Reports")
              .setValue("crab-sm_reports"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_trending_up:1349595567763751012>")
              .setLabel("Promotions, Infractions, and Demotions")
              .setValue("crab-sm_staff"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_repeat:1349598027236769822>")
              .setLabel("Change Module")
              .setValue("crab-sm_change")
          );
        const row = new ActionRowBuilder().addComponents(fdMedSelect);
        interaction.reply({
          embeds: [embed],
          components: [row],
          flags: MessageFlags.Ephemeral,
        });
      } else if (departmentType === 'dot') {
        const embed = new EmbedBuilder()
          .setColor("#b81e37")
          .setTitle("Configure Crab")
          .setDescription(`You have selected the **Department of Transportation** department type.\n\nNow, you will configure the modules for the **Department of Transportation** commands. The **Department of Transportation** type will allow the following modules to be used:\n* **<:crab_lock_pass:1349197473339670559> Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **<:crab_message:1399409507062382764> Configure Prefix**\n  * Change Crab's prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(GuildPrefix)}\n* **<:crab_clock:1349595336389427221> Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n* **<:crab_flag:1349595334463979550> Reports**\n  * Easily log your reports like: tow reports, scene reports, repair logs, and more!\n* **<:crab_trending_up:1349595567763751012> Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **<:crab_repeat:1349598027236769822> Change Module**\n  * Switch the module from **Department of Transportation** to **Law Enforcement** or **Fire and Medical** easily!`)

        const dotSelect = new StringSelectMenuBuilder()
          .setCustomId("crab-sm_dot-plugins")
          .setPlaceholder("Configure Department of Transportation Plugins")
          .setOptions(
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_lock_pass:1349197473339670559>")
              .setLabel("Configure Permissions")
              .setValue("crab-sm_perms"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_clock:1349595336389427221>")
              .setLabel("Shift Logging")
              .setValue("crab-sm_shifts"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_flag:1349595334463979550>")
              .setLabel("Reports")
              .setValue("crab-sm_reports"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_trending_up:1349595567763751012>")
              .setLabel("Promotions, Infractions, and Demotions")
              .setValue("crab-sm_staff"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("<:crab_repeat:1349598027236769822>")
              .setLabel("Change Module")
              .setValue("crab-sm_change")
          );
        const row = new ActionRowBuilder().addComponents(dotSelect);
        interaction.reply({
          embeds: [embed],
          components: [row],
          flags: MessageFlags.Ephemeral,
        });
      } else {
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
      interaction.reply({
        embeds: [embed],
        components: [departmentSelectionRow],
        flags: MessageFlags.Ephemeral,
      });
      }
    }
  },
};
