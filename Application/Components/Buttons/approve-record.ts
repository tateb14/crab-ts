import { EmbedBuilder, inlineCode, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ButtonInteraction, Client, GuildMember, User, Guild } from "discord.js";

import crabConfig from "../../Models/crab-config";
import guildRecord from "../../Models/guild-record";
import * as emojis from "../../../emojis.json";

export default {
    customId: "crab-button_record-approve",
    execute: async (interaction: ButtonInteraction, client: Client) => {
        const guild = interaction.guild as Guild
        const member = interaction.member as GuildMember;
        const user = interaction.user as User;
        if (!guild || !member || !user || user.bot) return;

        const guildConfig = await crabConfig.findOne({
            guildId: guild.id,
        });
        // ! Check guild config
        if (!guildConfig) {
            return interaction.reply({ content: `**@${user.username}**, no guild configuration was found. Please contact Tropical Systems.`, flags: MessageFlags.Ephemeral });
        }
        //? Fetch all role ids
        const personnelRoleId = guildConfig!.perms_PersonnelRole;
        const supervisorRoleId = guildConfig!.perms_SupervisorRole;
        const highCommRoleId = guildConfig!.perms_HiCommRole;
        const allAccessRoleId = guildConfig!.perms_AllAccessRole;
        if (!personnelRoleId || !supervisorRoleId || !highCommRoleId || !allAccessRoleId) {
            return interaction.reply({ content: `${emojis.x}, this server has not setup all permission roles.`, flags: MessageFlags.Ephemeral });
        }
        if (!member.roles.cache.hasAny(personnelRoleId, supervisorRoleId, highCommRoleId, allAccessRoleId)) {
            return interaction.reply({ content: `${emojis.x}, **@${user.username}**, you cannot use this command.`, flags: MessageFlags.Ephemeral });
        }
        const record = await guildRecord.findOneAndUpdate({ messageId: interaction.message.id }, { $set: { reviewedBy: interaction.user.id } }, { new: true });

        if (!record) {
            return interaction.reply({ content: `${emojis.x}, **@${user.username}**, no record was found with this id string, please input a different id.`, flags: MessageFlags.Ephemeral });
        }

        const embed = interaction.message.embeds[0];
        const recordIssuer = await guild.members.fetch(record.issuedBy);
        const approvedEmbed = EmbedBuilder.from(embed);
        approvedEmbed.setColor(0x2a9d8f);

        const serverButton = new ButtonBuilder().setCustomId("crab-button_server-name-disabled").setDisabled(true).setStyle(ButtonStyle.Secondary).setLabel(`Sent from ${guild.name}`);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(serverButton);

        interaction.update({
            content: `This record has been approved by ${interaction.user}`,
            embeds: [approvedEmbed],
            components: [],
        });
        if (recordIssuer) {
            try {
                await recordIssuer.send({
                    content: `**Record ID:** ${inlineCode(record.id)} has been approved by ${interaction.user}`,
                    components: [row],
                });
            } catch (err) {
                return interaction.followUp({ content: `${emojis.x}, **@${user.username}**, I could not direct message this user.`, flags: MessageFlags.Ephemeral });
            }
        }
    },
};
