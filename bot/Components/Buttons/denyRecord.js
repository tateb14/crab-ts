const { EmbedBuilder, inlineCode, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags, Message } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
const GuildRecord = require('../../schemas/GuildRecord')
module.exports = {
  customId: 'crab-button_record-deny',
  execute: async (interaction, client) => {
    const GuildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id }) 
    const SupervisorRole = GuildConfig.perms_SupervisorRole
    const HiCommRole = GuildConfig.perms_HiCommRole
    const AARole = GuildConfig.perms_AllAccessRole

    if (interaction.member.roles.cache.has(SupervisorRole || HiCommRole || AARole)) {
      const Record = await GuildRecord.findOneAndDelete(
      { messageId: interaction.message.id },
    )
      const embed = interaction.message.embeds[0]
      const user = await interaction.guild.members.fetch(Record.issuedBy);
      const DenyEmbed = EmbedBuilder.from(embed)
      DenyEmbed.setColor(0xec3935)
      interaction.update({ content: `This record has been denied by ${interaction.user}`, embeds: [DenyEmbed], components: [] })
      if (user) {
        try {
          await user.send(`**Record ID:** ${inlineCode(Record.id)} has been denied by ${interaction.user}`);
        } catch (err) {
          return interaction.followUp({ content: "I could not DM this user.", flags: MessageFlags.Ephemeral })
        }
      }
    } else {
      interaction.reply({ content: "**Insufficient** permissions.", flags: MessageFlags.Ephemeral })
    }
  }
}
