import { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags, ButtonInteraction, Guild, User, GuildMember } from "discord.js";
import crabConfig from "../../Models/crab-config";
import guildRecord from "../../Models/guild-record";
import guildReport from "../../Models/guild-report";
import crabPunishment from "../../Models/crab-punishment";
import { punishmentMap } from "../../Commands/Slash/punishment";
import { emojis } from '../../config';
import crabCustomReport from "../../Models/crab-custom-report";
import safeEdit from "../../Functions/safe-edit";

export default {
    customId: "crab_button-confirm_delete",
    execute: async (interaction: ButtonInteraction) => {
        const [_, messageId, authorizedUser, id] = interaction.customId.split(`:`);

        const guild = interaction.guild as Guild;
        const user = interaction.user as User;
        const member = interaction.member as GuildMember;

        if (!guild || !user || !member) return;

        let message = null;
        try {
            if (messageId && interaction.channel) {
                message = await interaction.channel.messages.fetch(messageId);
            }
        } catch (error: any) {
            if (error.code !== 10008) console.error(`[Fetch Error]`, error);
        }

        if (authorizedUser !== interaction.user.id) {
            return safeEdit(interaction, message, {
                content: `${emojis.x} **Access denied**, only the executor of this command can interact with this button.`,
                components: [],
            });
        }

        const fullPunishmentId = punishmentMap.get(id);
        let punishment;
        if (fullPunishmentId) {
            punishment = await crabPunishment.findOne({
                guildId: guild.id,
                punishment_id: fullPunishmentId,
            });
        }

        const report = await guildReport.findOne({
            guildId: guild.id,
            id: id,
        });
        const customReport = await crabCustomReport.findOne({
            guildId: guild.id,
            crab_ReportId: id,
        });
        const record = await guildRecord.findOne({
            guildId: guild.id,
            id: id,
        });

        if (report) {
            await report.deleteOne({ guildId: guild.id, id: id });
            await safeEdit(interaction, message, {
                content: `${emojis.check} **Successfully** removed the report.`,
                components: [],
            });
        } else if (customReport) {
            await customReport.deleteOne({
                guildId: guild.id,
                crab_ReportId: id,
            });
            await safeEdit(interaction, message, {
                content: `${emojis.check} **Successfully** removed this custom report.`,
                components: [],
            });
        } else if (record) {
            await record.deleteOne({ guildId: guild.id, id: id });
            await safeEdit(interaction, message, {
                content: `${emojis.check} **Successfully** removed the record.`,
                components: [],
            });
        } else if (punishment) {
            await punishment.deleteOne({
                guildId: guild.id,
                id: fullPunishmentId,
            });
            await safeEdit(interaction, message, {
                content: `${emojis.check} **Successfully** removed the punishment.`,
                components: [],
            });
        } else {
            await safeEdit(interaction, message, {
                content: `${emojis.x} I could not locate a log from the provided id. Please double check the ID and try again.`,
                components: [],
            });
        }
    },
};
