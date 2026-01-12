import { EmbedBuilder, inlineCode, ActionRowBuilder, MessageFlags, ButtonBuilder, ButtonStyle, Client, ButtonInteraction, GuildMember } from "discord.js";

import crabConfig from "../../Models/crab-config";
import guildRecord from "../../Models/guild-record";
import * as emojis from "../../../emojis.json";

export default {
    customId: "crab-button_record-deny",
    execute: async (interaction: ButtonInteraction, client: Client) => {
        const member = interaction.member as GuildMember;
        const guild = interaction.guild;
        const user = interaction.user;

        if (!guild || !member || !user) return;

        const guildConfig = await crabConfig.findOne({ guildId: guild.id });
        if (!guildConfig) {
            return interaction.reply({ content: `**@${user.username}**, no guild configuration was found. Please contact Tropical Systems.`, flags: MessageFlags.Ephemeral });
        }
        const supervisorRoleId = guildConfig!.perms_SupervisorRole;
        const highCommRoleId = guildConfig!.perms_HiCommRole;
        const allAccessRoleId = guildConfig!.perms_AllAccessRole;

        if (!supervisorRoleId || !highCommRoleId || !allAccessRoleId) {
            return interaction.reply({ content: `${emojis.x}, this server has not setup all permission roles.`, flags: MessageFlags.Ephemeral });
        }
        if (!member.roles.cache.hasAny(supervisorRoleId, highCommRoleId, allAccessRoleId)) {
            return interaction.reply({ content: `${emojis.x}, **@${user.username}**, you cannot use this command.`, flags: MessageFlags.Ephemeral });
        }
        const record = await guildRecord.findOneAndDelete({ messageId: interaction.message.id });

        if (!record) {
            return interaction.reply({ content: `${emojis.x}, **@${user.username}**, no record was found with this id string, please resend the record.`, flags: MessageFlags.Ephemeral });
        }

        const message = interaction.message.embeds[0];
        const recordIssuer = await interaction.guild.members.fetch(record.issuedBy);
        const denyEmbed = EmbedBuilder.from(message);
        denyEmbed.setColor(0xec3935);

        const serverButton = new ButtonBuilder().setCustomId("crab-button_server-name-disabled").setDisabled(true).setStyle(ButtonStyle.Secondary).setLabel(`Sent from ${interaction.guild.name}`);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(serverButton);

        interaction.update({ content: `This record has been denied by ${interaction.user}`, embeds: [denyEmbed], components: [] });
        if (recordIssuer) {
            try {
                await recordIssuer.send({ content: `**Record ID:** ${inlineCode(record.id)} has been denied by ${user}`, components: [row] });
            } catch (err) {
                return interaction.followUp({ content: "I could not DM this user.", flags: MessageFlags.Ephemeral });
            }
        }
    },
};
