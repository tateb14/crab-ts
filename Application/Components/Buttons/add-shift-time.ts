import { ActionRowBuilder, ButtonInteraction, Guild, GuildMember, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, User } from "discord.js";
import crabConfig from "../../Models/crab-config";
import { emojis } from '../../config';
export default {
    customId: "crab-button_shift-add-time",
    execute: async (interaction: ButtonInteraction) => {
        const [_, shiftId, messageId] = interaction.customId.split(":");
        const guild = interaction.guild as Guild;
        const member = interaction.member as GuildMember;
        const user = interaction.user as User;

        if (!guild || !member || !user) return;

        const guildConfig = await crabConfig.findOne({ guildId: guild.id });

        if (!guildConfig) {
            return interaction.reply({ content: `**@${user.username}**, no guild configuration was found. Please contact Tropical Systems.`, flags: MessageFlags.Ephemeral });
        }
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
        const timeAddModal = new ModalBuilder().setCustomId(`crab-modal_shift-add:${shiftId}:${messageId}`).setTitle("Add Time");
        const addTimeInput = new TextInputBuilder().setCustomId("crab-input_add-time").setLabel("How long do you want to add to the shift?").setPlaceholder("Please use commands like: 1s, 1m, 1h, 1d").setMinLength(2).setRequired(true).setStyle(TextInputStyle.Short);
        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(addTimeInput);
        timeAddModal.addComponents(row);
        await interaction.showModal(timeAddModal);
    },
};
