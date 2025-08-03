const { ActionRowBuilder, EmbedBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, Message } = require('discord.js')
const CrabUserFlags = require("../../schemas/CrabUserFlags")
console.log("hi")
module.exports = {
  customIdPrefix: 'crab-sm_flags',
  execute: async (interaction, client) => {
    const flags = interaction.values
    console.log(flags)
    const userId = interaction.customId.split(":")[1]
    const User = await CrabUserFlags.findOne({ userID: userId })
    if (!User) {
      const newFlaggedUser = new CrabUserFlags({
        userID: userId,
        flags: flags
      })
      await newFlaggedUser.save()
      interaction.reply("Flags applied to user.")
    } else {
      await CrabUserFlags.findOneAndUpdate(
        { userID: userId },
        { $set: { flags: flags } } 
       )
       await interaction.reply("Flags applied to user.")
    }
  }
}
