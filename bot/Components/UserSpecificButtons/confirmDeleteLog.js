const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
const CrabRecords = require("../../schemas/GuildRecord")
const CrabReports = require("../../schemas/GuildReport")
const CrabPunishments = require("../../schemas/CrabPunishment")
const { punishmentMap } = require("../../Commands/Slash/puishment")
module.exports = {
  customIdPrefix: 'crab_button-confirm_delete',
  execute: async (interaction) => {
    const [ _, messageId, authorizedUser, id ] = interaction.customId.split(":")
    const message = await interaction.channel.messages.fetch(messageId)
    await message.edit({ content: "<:crab_search:1412973394114248857> **Processing** your request...", components: [] })
    if (authorizedUser !== interaction.user.id) {
      return message.edit({ content: "<:crab_x:1409708189896671357> **Access denied**, only the executor of this command can interact with this button." })
    }
    const fullPunishmentId = punishmentMap.get(id);
    let Punishment;
    if (fullPunishmentId) {
      Punishment = await CrabPunishments.findOne({ guildId: interaction.guild.id, punishment_id: fullPunishmentId });
    }
    const Report = await CrabReports.findOne({ guildId: interaction.guild.id, id: id })
    const Record = await CrabRecords.findOne({ guildId: interaction.guild.id, id: id })
    if (Report) {
      await Report.deleteOne({ guildId: interaction.guild.id, id: id })
      message.edit("<:crab_check:1409695243816669316> **Successfully** removed the report.")
    } else if (Record) {
      await Record.deleteOne({ guildId: interaction.guild.id, id: id })
      message.edit("<:crab_check:1409695243816669316> **Successfully** removed the record.")
    } else if (Punishment) {
      await Punishment.deleteOne({ guildId: interaction.guild.id, id: fullPunishmentId })
      message.edit("<:crab_check:1409695243816669316> **Successfully** removed the punishment.")
    } else {
      message.edit("<:crab_x:1409708189896671357> I could not locate a log from the provided id. Please double check the ID and try again.")
    }

  }
}
