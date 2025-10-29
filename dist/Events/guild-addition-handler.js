"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config = require("../../config.json");
// const crabConfig = require("../schemas/CrabConfig")
// const CrabGuildExclusion = require("../schemas/CrabGuildExclusion")
module.exports = {
    event: "guildCreate",
    once: false,
    execute: async (client, guild) => {
        const channel = await client.channels.fetch(config.logging.joinLogs);
        // const guildExluded = await CrabGuildExclusion.findOne({ crab_guildId: guild.id })
        // if (guildExluded) {
        //   const user = await guild.fetchOwner()
        //   const ExclusionEmbed = new EmbedBuilder()
        //   .setColor(0xec3935)
        //   .setDescription("This message is in regards of the recent exclusion from the service of **Crab**.\n\nTo clarify, an exclusion from our service comes very rarely and is only applied if a server has broken our terms of service or violated a major rule. Exclusions are not appealable, but they can be removed if an Executive Board member choses to.\n\nThe details of your exclusion are confidential and secure to only Crab staff members. If you wish to inquiry about the exclusion, please see our [support](https://discord.gg/8XScx8MNfE).")
        //   .setFooter({ text: "Crab Legal Affairs Team" })
        //   .setTitle("Crab Exclusion Notice")
        //   .setTimestamp()
        //   const serverButton = new ButtonBuilder()
        //     .setCustomId("crab-button_server-name-disabled")
        //     .setDisabled(true)
        //     .setStyle(ButtonStyle.Secondary)
        //     .setLabel(`Official Notice from Tropical Systems`)
        //   const row = new ActionRowBuilder().addComponents(serverButton)
        //   try {
        //     await user.send({ embeds: [ExclusionEmbed], components: [row] })
        //   } catch (error) {
        //     return
        //   }
        //   client.guilds.cache.get(guild.id).leave()
        //   return;
        // }
        if (channel) {
            const joinEmbed = new discord_js_1.EmbedBuilder()
                .setColor(0xec3935)
                .setTitle("Guild Information")
                .addFields({
                name: "Guild Name:",
                value: `${guild.name}`,
                inline: true,
            }, {
                name: "Guild Id:",
                value: `${guild.id}`,
                inline: true,
            }, {
                name: "Guild Owner:",
                value: `<@${guild.ownerId}>`,
                inline: true,
            }, {
                name: "Guild Member Count:",
                value: `${guild.memberCount}`,
                inline: true,
            }, {
                name: "Guild Flags:",
                value: `**Partnered Guild?** ${guild.partnered}\n**Verified Guild?** ${guild.verified}\n`,
                inline: true,
            });
            // const config = new crabConfig({
            //   guildId: guild.id,
            // })
            // await config.save()
            const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            channel.send({ embeds: [joinEmbed], content: `**Crab** has joined a new guild! Our new guild count is: **${client.guilds.cache.size}** and our member count is: **${totalMembers}**.` });
        }
    }
};
