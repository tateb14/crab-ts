import { Client } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import * as config from "../../config.json";
export default async function (client: Client) {
    const clientEnviroment = config.client.enviroment
    try {
        //? Define __dirname and __filename
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const prefixPath = path.join(__dirname, "..", "Commands", "Prefix");
        const prefixFiles = fs
            .readdirSync(prefixPath)
            .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

        client.prefixCommands = new Map();

        for (const prefixFile of prefixFiles) {
            const prefixFilePath = path.join(prefixPath, prefixFile);
            const prefixCommandFile = await import(prefixFilePath);
            if (!prefixCommandFile.command) continue;

            client.prefixCommands.set(
                prefixCommandFile.command,
                prefixCommandFile
            );

            if (Array.isArray(prefixCommandFile.aliases)) {
                for (const prefixAlias of prefixCommandFile.aliases) {
                    client.prefixCommands.set(
                        prefixAlias.toLowerCase(),
                        prefixCommandFile
                    );
                }
            }
        }
        console.log(
            chalk.green.bold("[TS-PREFIX-SUCCESS] ") +
                `🐚 Successfully register all ${clientEnviroment} (prefix) commands.`
        );
    } catch (error) {
        throw new Error(
            chalk.red.bold("[TS-PREFIX-ERR] ") +
                `🐚 Failed to register all ${clientEnviroment} (prefix) commands.` +
                error
        );
    }
}
