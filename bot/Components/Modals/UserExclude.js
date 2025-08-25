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
    .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
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
