import { Client } from "discord.js";
import { REST, Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { config } from '../config';
import "dotenv/config";
import { fileURLToPath } from "url";

export default async function (client: Client) {
    //? Define __dirname and __filename
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const clientEnviroment = config.client.enviroment;
    let clientId: string
    let skipped: string[] = [];
    let rest;
    if (clientEnviroment === "beta") {
        if (!process.env.BETA_TOKEN) {
            throw new Error(
                chalk.red.bold("[TS-AUTH-ERR] ") +
                    "🦀 Missing beta authentication token."
            );
        }
        clientId = config.client.betaClientId
        rest = new REST({ version: "10" }).setToken(process.env.BETA_TOKEN);
    } else if (clientEnviroment === "qa" || clientEnviroment === "staging") {
        if (!process.env.QA_STG_TOKEN) {
            throw new Error(
                chalk.red.bold("[TS-AUTH-ERR] ") +
                    "🦀 Missing qa/staging authentication token."
            );
        }
        clientId = config.client.qaStgClientId
        rest = new REST({ version: "10" }).setToken(process.env.QA_STG_TOKEN);
    } else if (clientEnviroment === "production") {
        if (!process.env.PROD_TOKEN) {
            throw new Error(
                chalk.red.bold("[TS-AUTH-ERR] ") +
                    "🦀 Missing production authentication token."
            );
        }
        clientId = config.client.prodClientId
        rest = new REST({ version: "10" }).setToken(process.env.PROD_TOKEN);
    } else {
        throw new Error(
            chalk.red.bold("[TS-CORE-ERR] ") +
                "🍉 The enviroment was not configured correctly."
        );
    }

    client.slashCommands = new Map();

    const commands: any[] = [];
    const slashCommandPath = path.join(__dirname, "../Commands/Slash");
    const commandsFolder = fs
        .readdirSync(slashCommandPath)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    try {
        for (const file of commandsFolder) {
            const filePath = path.join(slashCommandPath, file);
            const fileImport = await import(filePath);
            const command = fileImport.default ?? fileImport;
            const commandData = command.data?.toJSON?.();
            if ("data" in command && "execute" in command) {
                client.slashCommands.set(commandData.name, command);
                commands.push(commandData);
            } else {
                skipped.push(path.basename(filePath));
            }
        }

        await rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        });
        console.log(
            chalk.green.bold("[TS-CMD-SUCCESS] ") +
                `🐚 Successfully registered all ${clientEnviroment} (/) commands.`
        );

        if (skipped.length > 0) {
            console.warn(
                chalk.yellow.bold("[TS-CMD-WARN] ") +
                    `🪼 Skipped ${
                        skipped.length
                    } invalid command(s): ${skipped.join(", ")}`
            );
        }
    } catch (error) {
        throw new Error(
            chalk.red.bold("[TS-CMD-ERR] ") +
                `🐚 Failed to register all ${clientEnviroment} (/) commands.` +
                error
        );
    }
}
