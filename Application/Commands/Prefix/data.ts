import { EmbedBuilder, Message, Client, Guild, User } from "discord.js";
import { detectIdType } from "../../Functions/detect-id-type";
import * as emoji from "../../../emojis.json";
export default {
    command: "data",
    aliases: ["d"],
    execute: async (message: Message, client: Client) => {
        const authorizedRoles = ["1350154554175520889", "1397681938629787773"];

        const guild = message.guild;
        const member = message.member;
        if (!guild) return;
        if (!member) return;

        if (!member.roles.cache.hasAny(...authorizedRoles)) return;
        if (guild.id !== "1348623820331679744") return;

        const args = message.content.trim().split(/ +/);
        const id = args.slice(1).join(" ").toLowerCase();
        const result = await detectIdType(client, id);
        const embed = new EmbedBuilder()
            .setColor(0xec3935)
            .setDescription("hi");
        if (result.type === "user") {
            const user = result.object as User;

            if (!user) return;
            message.reply("User");
        } else if (result.type === "guild") {
            const guild = result.object as Guild;
            if (!guild) return;
            embed.setAuthor({ name: `${guild.name} — Server Data` });
            message.reply({ embeds: [embed] });
        } else {
            message.reply(
                `${emoji.x} This is not a valid user/guild id, please try again with a valid id.`
            );
        }
    },
};
