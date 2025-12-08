import { Client } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

export default async (client: Client) => {
    try {
        //? Define __dirname and __filename
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const eventFolder = path.join(__dirname, "../Events");
        const eventFiles = fs
            .readdirSync(path.join(eventFolder))
            .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

        for (const eventFile of eventFiles) {
            const filePath = path.join(eventFolder, eventFile);
            const eventModule = await import(filePath);
            const eventData = eventModule.default ?? eventModule;
            try {
                if (eventData.once) {
                    client.once(eventData.event, (...args) =>
                        eventData.execute(client, ...args)
                    );
                } else {
                    client.on(eventData.event, (...args) =>
                        eventData.execute(client, ...args)
                    );
                }
            } catch (error) {
                throw new Error(
                    chalk.red.bold("[TS-EVENT-ERR] ") +
                        `🪸 Failed to load event: ${chalk.yellow(eventFile)}` +
                        error
                );
            }
        }
        console.log(
            chalk.green.bold("[TS-EVENT-SUCCESS] ") +
                `🦀 Successfully registered ${eventFiles.length} event(s).`
        );
    } catch (error) {
        throw new Error(
            chalk.red.bold("[TS-EVENT-ERR] ") +
                `🐚 Failed to register events` +
                error
        );
    }
};
