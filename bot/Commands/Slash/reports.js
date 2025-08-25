const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags } = require("discord.js")
const CrabConfig = require("../../schemas/CrabConfig")
const CrabReport = require("../../schemas/GuildReport")
module.exports = {
  data: new SlashCommandBuilder()
  .setName("report")
  .setDescription("..")

  .addSubcommand((subcommand) =>
  subcommand
  .setName("create")
  .setDescription("Open our report panel and create a report."))
  .addSubcommand((subcommand) => subcommand
  .setName("search")
  .setDescription("Search for a report via the identification string.")
  .addStringOption((option) => option
  .setName("report-id")
  .setDescription("The identification string of the report you are searching.")
  .setRequired(true)
)
  )
  .addSubcommand((subcommand) => subcommand
  .setName("void")
  .setDescription("Void/Delete a report via the identification string.")
  .addStringOption((option) => option
  .setName("report-id")
  .setDescription("The identification string of the report you are voiding/deleting.")
  .setRequired(true)
)
  ),
  execute: async (interaction) => {
    const subcommand = interaction.options.getSubcommand()
    const GuildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id })
    const GuildReports = await CrabRe
    const PersonnelRole = GuildConfig.perms_PersonnelRole
    const SupervisorRole = GuildConfig.perms_SupervisorRole
    const HiCommRole = GuildConfig.perms_HiCommRole
    const AARole = GuildConfig.perms_AllAccessRole
    const departmentType = GuildConfig.crab_DepartmentType
    if (interaction.member.roles.cache.has(PersonnelRole || SupervisorRole || HiCommRole || AARole)) {
     if (subcommand === "create") {
      if (departmentType === "leo") {
      const embed = new EmbedBuilder()
      .setColor(0xfaf3e0)
      .setDescription(`To record a report, please select which report you want to record. Each report is tailored to your department: **Law Enforcement**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Scene Reports\n- Incident Reports`)
      .setFooter({ text: "Powered by Crab" })
      .setTitle("Report Panel")

      const ReportSelectMenu = new StringSelectMenuBuilder()
      .setCustomId("crab-sm_report-leo")
      .setPlaceholder("Select a report type.")
      .addOptions(
        new StringSelectMenuOptionBuilder()
        .setLabel("Accident Report")
        .setDescription("File an accident report on your vehicle.")
        .setValue("crab_accident-report")
        .setEmoji("<:crab_car:1396636455392121023>"),
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
      )
      const row = new ActionRowBuilder().addComponents(ReportSelectMenu)
      interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral })
    } else if (departmentType === "fd-med") {
      const embed = new EmbedBuilder()
      .setColor(0xfaf3e0)
      .setDescription(`To record a report, please select which report you want to record. Each report is tailored to your department: **Fire and Medical**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Fire Reports\n- Medical Reports`)
      .setFooter({ text: "Powered by Crab" })
      .setTitle("Report Panel")

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
      )
      const row = new ActionRowBuilder().addComponents(ReportSelectMenu)
      interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral })
    } else if (departmentType === "dot") {
      const embed = new EmbedBuilder()
      .setColor(0xfaf3e0)
      .setDescription(`To record a report, please select which report you want to record. Each report is tailored to your department: **Department of Transportation**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Repair Reports\n- Tow Reports`)
      .setFooter({ text: "Powered by Crab" })
      .setTitle("Report Panel")

      const ReportSelectMenu = new StringSelectMenuBuilder()
      .setCustomId("crab-sm_report-dot")
      .setPlaceholder("Select a report type.")
      .addOptions(
        new StringSelectMenuOptionBuilder()
        .setLabel("Accident Report")
        .setDescription("File an accident report on your vehicle.")
        .setValue("crab_accident-report")
        .setEmoji("<:crab_car:1396636455392121023>"),
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
      )
      const row = new ActionRowBuilder().addComponents(ReportSelectMenu)
      interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral })
    } else {
      interaction.reply("Department **not configured**.")
    }
     } else if (subcommand === "search") {
      //! Needs coded
     } else if (subcommand === "void") {
      const Report = await GuildReports.findOne() 
     }
      
    } else {
      interaction.reply("**Insufficient** permissions.")
    }
  }
}
