const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const CrabReport = require("../../schemas/GuildReport");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("..")

    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Open our report panel and create a report.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search for a report via the identification string.")
        .addUserOption((user) =>
          user
            .setName("staff-username")
            .setDescription(
              "The username of the staff member your are searching reports for."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("void")
        .setDescription("Void/Delete a report via the identification string.")
        .addStringOption((option) =>
          option
            .setName("report-id")
            .setDescription(
              "The identification string of the report you are voiding/deleting."
            )
            .setRequired(true)
        )
    ),
  execute: async (interaction) => {
    const subcommand = interaction.options.getSubcommand();
    const GuildConfig = await CrabConfig.findOne({
      guildId: interaction.guild.id,
    });
    const GuildReports = await CrabReport.find({
      guildId: interaction.guild.id,
    });
    const PersonnelRole = GuildConfig.perms_PersonnelRole;
    const SupervisorRole = GuildConfig.perms_SupervisorRole;
    const HiCommRole = GuildConfig.perms_HiCommRole;
    const AARole = GuildConfig.perms_AllAccessRole;
    const departmentType = GuildConfig.crab_DepartmentType;
    if (
      interaction.member.roles.cache.has(
        PersonnelRole || SupervisorRole || HiCommRole || AARole
      )
    ) {
      if (subcommand === "create") {
        if (departmentType === "leo") {
          const embed = new EmbedBuilder()
            .setColor(0xfaf3e0)
            .setDescription(
              `To record a report, please select which report you want to record. Each report is tailored to your department: **Law Enforcement**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Scene Reports\n- Incident Reports`
            )
            .setFooter({ text: "Powered by Crab" })
            .setTitle("Report Panel")
            .setImage(
              "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
            );

          const ReportSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("crab-sm_report-leo")
            .setPlaceholder("Select a report type.")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("Accident Report")
                .setDescription("File an accident report on your vehicle.")
                .setValue("crab_accident-report")
                .setEmoji("<:crab_car:1409695280483270656>"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Scene Report")
                .setDescription("File an scene report on a crime scene.")
                .setValue("crab_scene-report")
                .setEmoji("<:crab_clipboard:1349595335378337833>"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Incident Report")
                .setDescription("File an incident report.")
                .setValue("crab_incident-report")
                .setEmoji("<:crab_flag:1349595334463979550>")
            );
          const row = new ActionRowBuilder().addComponents(ReportSelectMenu);
          interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral,
          });
        } else if (departmentType === "fd-med") {
          const embed = new EmbedBuilder()
            .setColor(0xfaf3e0)
            .setDescription(
              `To record a report, please select which report you want to record. Each report is tailored to your department: **Fire and Medical**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Fire Reports\n- Medical Reports`
            )
            .setFooter({ text: "Powered by Crab" })
            .setImage(
              "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
            )
            .setTitle("Report Panel");

          const ReportSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("crab-sm_report-fd-med")
            .setPlaceholder("Select a report type.")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("Accident Report")
                .setDescription("File an accident report on your vehicle.")
                .setValue("crab_accident-report")
                .setEmoji("<:crab_firetruck:1349197479664685168>"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Fire Report")
                .setDescription("File an fire report.")
                .setValue("crab_fire-report")
                .setEmoji("<:crab_flame:1396639743260753941>"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Medical Report")
                .setDescription("File an medical report.")
                .setValue("crab_medical-report")
                .setEmoji("<:crab_medicalcross:1396639745362366527>")
            );
          const row = new ActionRowBuilder().addComponents(ReportSelectMenu);
          interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral,
          });
        } else if (departmentType === "dot") {
          const embed = new EmbedBuilder()
            .setColor(0xec3935)
            .setDescription(
              `To record a report, please select which report you want to record. Each report is tailored to your department: **Department of Transportation**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Repair Reports\n- Tow Reports`
            )
            .setFooter({ text: "Powered by Crab" })
            .setImage(
              "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
            )
            .setTitle("Report Panel");

          const ReportSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("crab-sm_report-dot")
            .setPlaceholder("Select a report type.")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("Accident Report")
                .setDescription("File an accident report on your vehicle.")
                .setValue("crab_accident-report")
                .setEmoji("<:crab_car:1409695280483270656>"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Repair Report")
                .setDescription("File an repair report.")
                .setValue("crab_repair-report")
                .setEmoji("<:crab_barrier:1349197476003057676>"),
              new StringSelectMenuOptionBuilder()
                .setLabel("Tow Report")
                .setDescription("File an tow report.")
                .setValue("crab_tow-report")
                .setEmoji("<:crab_flag:1349595334463979550>")
            );
          const row = new ActionRowBuilder().addComponents(ReportSelectMenu);
          interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral,
          });
        } else {
          interaction.reply("Department **not configured**.");
        }
      } else if (subcommand === "search") {
        const userId = interaction.options.getUser("staff-username").id;
        const UserReports = await CrabReport.find({
          guildId: interaction.guild.id,
          IssuedBy: userId,
        })
          .sort({ _id: -1 })
          .limit(10);
        if (UserReports.length === 0) {
          return interaction.reply({
            content: "This user has not yet created a report.",
          });
        }
        try {
          let Reports = [];
          for (const Report of UserReports) {
            const ReportID = Report.id;
            const ReportDescription = Report.Description;
            const ReportReviewer = Report.ReviewedBy
            const embed = new EmbedBuilder()
              .setColor(0xec3935)
              .setFooter({ text: `Report ID: ${ReportID}` })
              .setDescription(
                `Below are details of the ${Report.ReportType} report submitted by <@${Report.IssuedBy}>.`
              )
              .setImage(
                "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
              )
              .setTitle(`${Report.ReportType} Report`)
              .addFields(
                {
                  name: `Report Creator:`,
                  value: `<@${Report.IssuedBy}>`,
                },
                {
                  name: `Report Description`,
                  value: `${ReportDescription}`,
                },
              );
              if (Report.ReviewedBy !== null) {
                embed.addFields({
                  name: "Reviewed by:",
                  value: `<@${ReportReviewer}>`
                })
              }
            Reports.push(embed);
          }
          await interaction.reply({
            embeds: Reports,
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          interaction.reply({
            content: `Error: ${error}`,
            flags: MessageFlags.Ephemeral,
          });
        }
      } else if (subcommand === "void") {
        const Report = await GuildReports.Findone();
      }
    } else {
      interaction.reply("**Insufficient** permissions.");
    }
  },
};
