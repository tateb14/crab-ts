import { Client } from "discord.js";

export async function detectIdType(client: Client, id: string) {
    const user = await client.users.fetch(id).catch(() => null);
    if (user) return { type: "user", object: user };
    const guild = await client.guilds.fetch(id).catch(() => null);
    if (guild) return { type: "guild", object: guild };

    return { type: "unknown", object: null };
}
