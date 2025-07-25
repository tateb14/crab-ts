const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, User, Message } = require("discord.js")
const CrabUserExclusion = require("../../schemas/CrabUserExclusion")
module.exports = {
  customId: "crab-modal_user-exclude",
  execute: async (interaction) => {
    const UserId = interaction.fields.getTextInputValue("crab-exclude_user-id")
    const Reason = interaction.fields.getTextInputValue("crab-exclude_reason")
    const Proof = interaction.fields.getTextInputValue("crab-exclude_proof")
    const Issuer = interaction.user
    const embed = new EmbedBuilder()
    .setTitle(`User Exclusion created by @${Issuer.username}`)
    .addFields(
      {
        name: "Excluding:",
        value: `<@${UserId}> // ${UserId}`
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
    const newExclusion = new CrabUserExclusion({
      crab_UserID: UserId,
      issuedBy: Issuer.id,
      crab_Reason: Reason,
      crab_Proof: Proof
    })
    await newExclusion.save()
    interaction.reply({ content: "Exclusion created and complete.", flags: MessageFlags.Ephemeral })
   await ExclusionChannel.send({ embeds: [embed], components: [row] })
  }
}
