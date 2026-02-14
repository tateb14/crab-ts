import { EmbedBuilder, inlineCode, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ButtonInteraction, Client, Guild, User, GuildMember, Embed, APIActionRowComponent, APIButtonComponent } from "discord.js";
import crabConfig from "../../Models/crab-config";
import guildReport from "../../Models/guild-report";
import { emojis } from '../../config';
export default {
    customId: "crab-button_review-report",
    execute: async (interaction: ButtonInteraction, client: Client) => {
        const guild = interaction.guild as Guild;
        const user = interaction.user as User;
        const member = interaction.member as GuildMember;

        if (!guild || !user || !member) return;
        const guildConfig = await crabConfig.findOne({ guildId: guild.id });

        const supervisorRoleId = guildConfig!.perms_SupervisorRole;
        const highCommRoleId = guildConfig!.perms_HiCommRole;
        const allAccessRoleId = guildConfig!.perms_AllAccessRole;

        if (!supervisorRoleId || !highCommRoleId || !allAccessRoleId) {
            return interaction.reply({ content: `${emojis.x}, this server has not setup all permission roles.`, flags: MessageFlags.Ephemeral });
        }
        if (!member.roles.cache.hasAny(supervisorRoleId, highCommRoleId, allAccessRoleId)) {
            return interaction.reply({ content: `${emojis.x}, **@${user.username}**, you cannot use this command.`, flags: MessageFlags.Ephemeral });
        }
        const report = await guildReport.findOne({ messageId: interaction.message.id });

        if (!report) {
            return interaction.reply({ content: `${emojis.x}, **@${user.username}**, no report was found with this id string, please resend the report.`, flags: MessageFlags.Ephemeral });
        }
        const embed = interaction.message.embeds[0] as Embed;
        const reportIssuer = await guild.members.fetch(report?.issuedBy);
        const reviewEmbed = EmbedBuilder.from(embed);
        const buttons = interaction.message.components;
        const row = ActionRowBuilder.from<ButtonBuilder>(buttons[0] as APIActionRowComponent<APIButtonComponent>);
        const startButton = row.components[0];
        startButton.setDisabled(true);
        startButton.setLabel(`Reviewed by @${user.username}`);
        const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(startButton);
        reviewEmbed.setColor(0x39ec35);
        const serverButton = new ButtonBuilder().setCustomId("crab-button_server-name-disabled").setDisabled(true).setStyle(ButtonStyle.Secondary).setLabel(`Sent from ${guild.name}`);
        const serverRow = new ActionRowBuilder<ButtonBuilder>().addComponents(serverButton);
        interaction.update({ content: `This record has been reviewed by ${user}`, embeds: [reviewEmbed], components: [newRow] });
        if (reportIssuer) {
            try {
                await reportIssuer.send({ content: `**Report ID:** ${inlineCode(report.id)} has been reviewed by ${user}`, components: [serverRow] });
            } catch (err) {
                return interaction.followUp({ content: "I could not DM this user.", flags: MessageFlags.Ephemeral });
            }
        }
    },
};
