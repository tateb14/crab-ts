const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, User, Message, inlineCode } = require("discord.js")
const CrabConfig = require("../../schemas/CrabConfig")
module.exports = {
  customId: "crab-modal_prefix",
  execute: async (interaction) => {
    const Prefix = interaction.fields.getTextInputValue("crab-text_prefix")
    await CrabConfig.updateOne(
      { guildId: interaction.guild.id },
      { $set: { crab_Prefix: Prefix } },
      { new: true, upsert: true }
    )

    interaction.reply({ content: `You have configured your guild prefix to ${inlineCode(Prefix)}.`, flags: MessageFlags.Ephemeral })
    }
  }
