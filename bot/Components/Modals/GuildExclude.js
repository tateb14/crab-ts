const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, User, Message, Guild } = require("discord.js")
const CrabGuildExclusion = require("../../schemas/CrabGuildExclusion")
module.exports = {
  customId: "crab-modal_guild-exclude",
  execute: async (interaction) => {
    const GuildId = interaction.fields.getTextInputValue("crab-exclude_guild-id")
    const Reason = interaction.fields.getTextInputValue("crab-exclude_reason")
    const Proof = interaction.fields.getTextInputValue("crab-exclude_proof")
    const Issuer = interaction.user
    const embed = new EmbedBuilder()
    .setTitle(`Guild Exclusion created by @${Issuer.username}`)
    .addFields(
      {
        name: "Excluding (Guild ID):",
        value: `${GuildId}`
      },
      {
        name: "Reason:",
        value: `${Reason}`
      }
    )

    const ProofButton = new ButtonBuilder()
    .setLabel("Proof for Exclusion")
    .setURL(Proof)
    .setStyle(ButtonStyle.Link)

    const row = new ActionRowBuilder().addComponents(ProofButton)
    const ExclusionChannel = await interaction.guild.channels.fetch("1398166536971091978")
    const newExclusion = new CrabGuildExclusion({
      crab_guildId: GuildId,
      issuedBy: Issuer.id,
      crab_Reason: Reason,
      crab_Proof: Proof
    })
    await newExclusion.save()
    interaction.reply({ content: "Exclusion created and complete.", flags: MessageFlags.Ephemeral })
   await ExclusionChannel.send({ embeds: [embed], components: [row] })
  }
}
