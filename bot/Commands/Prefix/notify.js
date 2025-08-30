const { EmbedBuilder, inlineCode, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, Guild, codeBlock } = require("discord.js")
const detectIdType = require("../../Functions/detectIdType")
const CrabBetaServer = require("../../schemas/CrabBetaServers")
module.exports = {
  command: "notify",
  execute: async (message, client) => {
    const AuthorizedRoles = ["1265766750994043022", "1266182977755287613"];
    if (!AuthorizedRoles.some((roleId) => message.member.roles.cache.has(roleId))) {
      return
    }
    const args = message.content.trim().split(/ +/);
    const msg = args.slice(1).join(" ").toLowerCase(); // Message to be sent.
    const BetaServers = await CrabBetaServer.find()
    const response = await message.reply("Sending messages to server owners...")
    let count = 0
    let duplicateDMCount = 0
    const alreadyDMd = new Set();
    if (BetaServers.length === 0) {
     return response.edit(`<:crab_check:1409695243816669316> Successfully sent message to ${inlineCode(count)}/${inlineCode(BetaServers.length)} owners.`)
    }
    for (const Server of BetaServers) {
      const Owner = Server.ownerId
      const User = await client.users.fetch(Owner)
      if (alreadyDMd.has(Owner)) {
        duplicateDMCount++
        continue;
      }
      try {
        await User.send(`A new notification has been sent by <@${message.author.id}> (${inlineCode(message.author.id)}), please see below!\n\n${codeBlock(msg)}`)
        alreadyDMd.add(Owner);
        count++;
      } catch (error) {
        console.error(`Could not DM ${User.username}`, err);
      }
    }

    await response.edit(`<:crab_check:1409695243816669316> Successfully sent message to ${inlineCode(count)}/${inlineCode(BetaServers.length)} owners. I skipped ${inlineCode(duplicateDMCount)} owners due to duplicates.`)
}
}
