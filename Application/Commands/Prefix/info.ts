import { Client, EmbedBuilder, Message } from "discord.js";
import * as emojis from "../../../emojis.json";

export default {
    command: "info",
    aliases: ["i", "information"],
    execute: async (message: Message, client: Client) => {
        const guildSize = message.client.guilds.cache.size ?? "Unknown"
        const memberSize = message.client.users.cache.size ?? "Unknown"
        const infoEmbed = new EmbedBuilder()
                .setTitle(`${emojis.icon || "🦀"} Crab Information`)
                .setDescription(
                    `Crab is a versatile, one of a kind department management bot. Forget any other bot, Crab's sole purpose is to manage your department, with ease! We have each essential department type: **Law Enforcement, Fire and Medical, and Department of Transportation** for your leisure.`
                )
                .setFooter({
                    text: `Guild Count: ${guildSize} | Member Count: ${memberSize}`,
                })
                .setColor(0xec3935)
                .setImage(
                    "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
                )
                .addFields({
                    name: "Crab Information",
                    value: `- Database: **MongoDB**\n- [Status Page](https://discord.gg)`,
                });
            
            await message.reply({ embeds: [infoEmbed] });
    },
};
