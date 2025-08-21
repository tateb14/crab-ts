const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const crabConfig = require('../../schemas/CrabConfig')
const responses = require('../../Functions/responses')
module.exports = {
  customIdPrefix: 'crab-button_shift-subtract-time',
  execute: async (interaction) => {
    const [_, shiftId, messageId] = interaction.customId.split(":")
    const GuildConfig = await crabConfig.findOne({ guildId: interaction.guild.id })
    const HiCommRole = GuildConfig.perms_HiCommRole
    const AARole = GuildConfig.perms_AllAccessRole
    const AuthorizedRoles = [HiCommRole, AARole]
    if (!AuthorizedRoles.some(roleId => interaction.member.roles.cache.has(roleId))) {
    return interaction.reply(responses.errors.insufficientPermissions)
    }
    const modal = new ModalBuilder()
    .setCustomId(`crab-modal_shift-subtract:${shiftId}:${messageId}`)
    .setTitle("Subtract Time")
    const SubtractInput = new TextInputBuilder()
    .setCustomId("crab-input_subtract-time")
    .setLabel("How much should be subtracted?")
    .setMinLength(2)
    .setPlaceholder("Please use commands like: 1s, 1m, 1h, 1d")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    const row = new ActionRowBuilder().addComponents(SubtractInput)
    modal.addComponents(row)
    await interaction.showModal(modal)
  }
}
