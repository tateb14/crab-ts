const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const responses = require('../../Functions/responses')
const crabConfig = require('../../schemas/CrabConfig')
module.exports = {
  customIdPrefix: 'crab-button_shift-add-time',
  execute: async (interaction) => {
    const [_, shiftId, messageId] = interaction.customId.split(":")
    const GuildConfig = await crabConfig.findOne({ guildId: interaction.guild.id })
    const HiCommRole = GuildConfig.perms_HiCommRole
    const AARole = GuildConfig.perms_AllAccessRole
    const AuthorizedRoles = [HiCommRole, AARole]
    console.log(AuthorizedRoles)
    if (!AuthorizedRoles.some(roleId => interaction.member.roles.cache.has(roleId))) {
      return interaction.reply(responses.errors.insufficientPermissions)
    }
    const modal = new ModalBuilder()
    .setCustomId(`crab-modal_shift-add:${shiftId}:${messageId}`)
    .setTitle("Add Time")
    const AddInput = new TextInputBuilder()
    .setCustomId("crab-input_add-time")
    .setLabel("How long do you want to add to the shift?")
    .setPlaceholder("Please use commands like: 1s, 1m, 1h, 1d")
    .setMinLength(2)
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    const row = new ActionRowBuilder().addComponents(AddInput)
    modal.addComponents(row)
    await interaction.showModal(modal)
  }
}
