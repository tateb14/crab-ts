import { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags, ButtonBuilder, ButtonStyle, inlineCode, ChatInputCommandInteraction, GuildMember } from "discord.js";
import crabConfig from "../../Models/crab-config";
import guildReport from "../../Models/guild-report";
import crabCustomReport from "../../Models/crab-custom-report";
import * as emojis from "../../../emojis.json";

export default {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("..")

        .addSubcommand((subcommand) => subcommand.setName("create").setDescription("Open our report panel and create a report."))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("search")
                .setDescription("Search for a report via the identification string.")
                .addUserOption((user) => user.setName("staff-username").setDescription("The username of the staff member your are searching reportEmbeds for.").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("void")
                .setDescription("Void/Delete a report via the identification string.")
                .addStringOption((option) => option.setName("report-id").setDescription("The identification string of the report you are voiding/deleting.").setRequired(true))
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        //? CONSTANTS
        const END_REPORT_NAMES = "Report";

        //? GLOBAL CHECKS
        const guild = interaction.guild;
        const member = interaction.member as GuildMember;

        if (!guild || !member) return;

        //? get the subcommand
        const subcommand = interaction.options.getSubcommand();
        const guildConfig = await crabConfig.findOne({
            guildId: interaction.guild.id,
        });
        const guildReports = await guildReport.find({
            guildId: guild.id,
        });
        const guildCustomReports = await crabCustomReport.find({
            guildId: guild.id,
        });
        const personnelRoleId = guildConfig!.perms_PersonnelRole;
        const supervisorRoleId = guildConfig!.perms_SupervisorRole;
        const highCommRoleId = guildConfig!.perms_HiCommRole;
        const allAccessRoleId = guildConfig!.perms_AllAccessRole;
        const departmentType = guildConfig!.crab_DepartmentType;

        if (!departmentType) {
            return interaction.reply({ content: `${emojis.x}, this server has not configured the department type. You cannot use this command.`, flags: MessageFlags.Ephemeral });
        }
        if (!personnelRoleId || !supervisorRoleId || !highCommRoleId || !allAccessRoleId) {
            return interaction.reply({ content: `${emojis.x}, this server has not setup all permission roles.`, flags: MessageFlags.Ephemeral });
        }
        if (!member.roles.cache.hasAny(personnelRoleId, supervisorRoleId, highCommRoleId, allAccessRoleId)) {
            return interaction.reply({ content: `${emojis.x}, **@${interaction.user.username}**, you cannot use this command.`, flags: MessageFlags.Ephemeral });
        }

        if (subcommand === "create") {
            //? define base embed and string select menu
            const embed = new EmbedBuilder().setColor(0xec3935).setFooter({ text: "Powered by Crab" }).setTitle("Report Panel").setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&");
            let reportSelectMenu = new StringSelectMenuBuilder();

            if (departmentType === "leo") {
                // prettier-ignore
                embed.setDescription(`To record a report, please select which report you want to record. Each report is tailored to your department: **Law Enforcement**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Scene Reports\n- Incident Reports`)
                // prettier-ignore
                reportSelectMenu.setCustomId("crab-sm_report-leo")
                .setPlaceholder("Select a report type.")
                .addOptions(
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Accident Report")
                        .setDescription("File an accident report on your vehicle.")
                        .setValue("crab_accident-report").setEmoji(emojis.car),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Scene Report")
                        .setDescription("File an scene report on a crime scene.")
                        .setValue("crab_scene-report")
                        .setEmoji(emojis.clipboard),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Incident Report")
                        .setDescription("File an incident report.")
                        .setValue("crab_incident-report")
                        .setEmoji(emojis.flag)
                    );
            } else if (departmentType === "fd-med") {
                // prettier-ignore
                embed.setDescription(`To record a report, please select which report you want to record. Each report is tailored to your department: **Fire and Medical**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Fire Reports\n- Medical Reports`).setFooter({ text: "Powered by Crab" }).setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&").setTitle("Report Panel");
                // prettier-ignore
                reportSelectMenu.setCustomId("crab-sm_report-fd-med")
                .setPlaceholder("Select a report type.")
                .addOptions(
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Accident Report")
                        .setDescription("File an accident report on your vehicle.")
                        .setValue("crab_accident-report").setEmoji(emojis.fire_truck),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Fire Report")
                        .setDescription("File an fire report.")
                        .setValue("crab_fire-report")
                        .setEmoji(emojis.flame),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Medical Report")
                        .setDescription("File an medical report.")
                        .setValue("crab_medical-report")
                        .setEmoji(emojis.medical_cross)
                    );
            } else if (departmentType === "dot") {
                embed.setDescription(`To record a report, please select which report you want to record. Each report is tailored to your department: **Department of Transportation**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Repair Reports\n- Tow Reports`).setFooter({ text: "Powered by Crab" }).setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&").setTitle("Report Panel");
                // prettier-ignore
                reportSelectMenu.setCustomId("crab-sm_report-dot")
                .setPlaceholder("Select a report type.")
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Accident Report")
                    .setDescription("File an accident report on your vehicle.")
                    .setValue("crab_accident-report")
                    .setEmoji(emojis.car),
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Repair Report")
                    .setDescription("File an repair report.")
                    .setValue("crab_repair-report")
                    .setEmoji(emojis.barrier),
                    new StringSelectMenuOptionBuilder()
                    .setLabel("Tow Report")
                    .setDescription("File an tow report.")
                    .setValue("crab_tow-report")
                    .setEmoji(emojis.flag)
                );
            }
            if (guildCustomReports.length !== 0) {
                const customReportsNames = [];
                for (let i = 0; i < guildCustomReports.length; i++) {
                    const customReport = guildCustomReports[i];
                    const emoji = emojis[`circle_${i + 1}` as keyof typeof emojis];
                    customReportsNames.push(`- ${customReport.crab_ReportName}`);
                    const customReportSelect = new StringSelectMenuOptionBuilder().setLabel(customReport.crab_ReportName).setEmoji(emoji).setValue(`crab_custom_report:${customReport.crab_ReportId}`);
                    reportSelectMenu.addOptions(customReportSelect);
                }
                embed.addFields({
                    name: "Custom Reports:",
                    value: customReportsNames.join("\n"),
                });
            }
            const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(reportSelectMenu);
            interaction.reply({
                embeds: [embed],
                components: [row],
                flags: MessageFlags.Ephemeral,
            });
        } else if (subcommand === "search") {
            //? get command data
            const user = interaction.options.getUser("staff-username");

            // ? fetch reportEmbeds made by the user, 10 most recent
            const userReports = await guildReport.find({ guildId: interaction.guild.id, issuedBy: user!.id }).sort({ _id: -1 }).limit(10);

            // ? if none, it will return an error
            if (userReports.length === 0) {
                return interaction.reply({
                    content: `${emojis.x}, **@${user!.username}** has not yet made a report.`,
                });
            }


            try {
                let reportEmbeds: object[] = []; // * define the reportsEmbed array
                for (const report of userReports) { // * for each report the user has made, it will add that report to the array.
                    // ? get the report id
                    const reportId = report.id;
                    let reportName: string[] = []; // ? define the report name string fix
                    const embed = new EmbedBuilder(); // * define the embed
                    // ? fetch description and reviewers
                    const reportDescription = report.description;
                    const reportReviewer = report.reviewedBy;

                    if (report.reportType === "custom") { // * if its a custom report, do the following:
                        const customReportInformation = await crabCustomReport.findOne({
                            guildId: interaction.guild.id,
                            crab_ReportId: report.custom_reportId,
                        });

                        if (!customReportInformation) {
                            return interaction.reply({ content: `${emojis.x}, **@${interaction.user.username}**, this custom report type was not found.\n-# This action was aborted.` });
                        }

                        if (customReportInformation.crab_ReportName.endsWith(END_REPORT_NAMES)) {
                            reportName.push(customReportInformation.crab_ReportName);
                        } else {
                            reportName.push(customReportInformation.crab_ReportName, END_REPORT_NAMES);
                            reportName.join(" ");
                        }

                        if (report.custom_field1 !== null) {
                            embed.addFields({
                                name: `${customReportInformation.crab_ReportField1Label}:`,
                                value: `${report.custom_field1}`,
                            });
                        }
                        if (report.custom_field2 !== null) {
                            embed.addFields({
                                name: `${customReportInformation.crab_ReportField2Label}:`,
                                value: `${report.custom_field2}`,
                            });
                        }
                        if (report.custom_field3 !== null) {
                            embed.addFields({
                                name: `${customReportInformation.crab_ReportField3Label}:`,
                                value: `${report.custom_field3}`,
                            });
                        }
                        if (reportReviewer !== null) {
                            embed.addFields({
                                name: `Report Reviewer:`,
                                value: `<@${reportReviewer}>`,
                            });
                        }
                    } else {
                        if (!report.reportType.endsWith(END_REPORT_NAMES)) {
                            reportName.push(report.reportType, END_REPORT_NAMES);
                            reportName.join(" ");
                        }

                        if (reportReviewer !== null) {
                            embed.addFields({
                                name: "Reviewed by:",
                                value: `<@${reportReviewer}>`,
                            });
                        }
                    }
                    embed
                        .setColor(0xec3935)
                        .setFooter({ text: `Report ID: ${reportId}` })
                        .setDescription(`Below are details of the **${reportName}** submitted by <@${report.issuedBy}>.`)
                        .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
                        .setTitle(`${reportName}`)
                        .addFields({
                            name: `Report Description`,
                            value: `${reportDescription}`,
                        });

                    reportEmbeds.push(embed);
                }
                await interaction.reply({
                    embeds: reportEmbeds,
                    flags: MessageFlags.Ephemeral,
                });
            } catch (error) {
                // ! Need to check if error is handled by handler.
            }
        } else if (subcommand === "void") {
            const reportId = interaction.options.getString("report-id");
            await interaction.reply({
                content: `${emojis.search} **Fetching** the report...`,
            });
            const response = await interaction.fetchReply();
            const report = await guildReport.findOne({
                guildId: interaction.guild.id,
                id: reportId,
            });
            if (!report) {
                return await interaction.editReply({
                    content: `${emojis.x}, **@${interaction.user.username}** I was unable to locate a report with the id ${inlineCode(reportId!)}, please double check the ID and try again.`,
                });
            }
            // prettier-ignore
            const confirmDelete = new ButtonBuilder()
            .setCustomId(`crab_button-confirm_delete:${response.id}:${interaction.user.id}:${reportId}`)
            .setEmoji(emojis.check)
            .setLabel("Confirm Delete")
            .setStyle(ButtonStyle.Danger);
            // prettier-ignore
            const cancelDelete = new ButtonBuilder()
            .setCustomId(`crab_button-cancel_delete:${response.id}:${interaction.user.id}`)
            .setEmoji(emojis.x)
            .setLabel("Cancel Delete")
            .setStyle(ButtonStyle.Secondary);

            const confirmationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmDelete, cancelDelete);
            await interaction.editReply({
                content: `${emojis.check}, **@${interaction.user.username}**, I was able to locate a report with the id ${inlineCode(reportId!)}, would you like to proceed and void the report?\n-# This action is **irreversible**.`,
                components: [confirmationRow],
            });
        }
    },
};
