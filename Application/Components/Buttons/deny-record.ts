import { EmbedBuilder, inlineCode, ActionRowBuilder, MessageFlags, ButtonBuilder, ButtonStyle, Client, ButtonInteraction } from 'discord.js'

const CrabConfig = require('../../schemas/CrabConfig')
const GuildRecord = require('../../schemas/GuildRecord')

module.exports = {
  customId: 'crab-button_record-deny',
  execute: async (interaction: ButtonInteraction, client: Client) => {
    const member = interaction.member
    const guild = interaction.guild

    if (!guild || !member) 
    {
        return;
    }

    const guildConfig = await CrabConfig.findOne({ guildId: guild.id }) 
    const supervisorRole = guildConfig.perms_SupervisorRole
    const hiCommRole = guildConfig.perms_HiCommRole
    const aARole = guildConfig.perms_AllAccessRole

    if (member.roles.cache.has(supervisorRole || hiCommRole || aARole)) 
    {
      const Record = await GuildRecord.findOneAndDelete( { messageId: interaction.message.id } )

      const embed = interaction.message.embeds[0]
      const user = await interaction.guild.members.fetch(Record.issuedBy);
      const denyEmbed = EmbedBuilder.from(embed)
      denyEmbed.setColor(0xec3935)

      const serverButton = new ButtonBuilder()
        .setCustomId("crab-button_server-name-disabled")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Sent from ${interaction.guild.name}`)

      const row = new ActionRowBuilder().addComponents(serverButton)

      interaction.update({ content: `This record has been denied by ${interaction.user}`, embeds: [denyEmbed], components: [] })
      if (user) 
      {
        try 
        {
          await user.send({ content: `**Record ID:** ${inlineCode(Record.id)} has been denied by ${interaction.user}`, components: [row]});
        } 
        catch (err) 
        {
          return interaction.followUp({ content: "I could not DM this user.", flags: MessageFlags.Ephemeral })
        }
      }
    } 
    else 
    {
      interaction.reply({ content: "**Insufficient** permissions.", flags: MessageFlags.Ephemeral })
    }
  }
}