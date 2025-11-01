import { Client } from "discord.js";
import { REST, Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";
import * as config from "../../config.json";
import "dotenv/config";

export default async function (client: Client) {
  const clientEnviroment = config.client.enviroment;
  let skipped: string[] = [];
  let rest;
  if (clientEnviroment === "beta") {
    if (!process.env.BETA_TOKEN) {
      console.error(
        chalk.red.bold("[TS-AUTH-ERR] ") + "🦀 Missing beta authentication token."
      );
      process.exit(1);
    }
    rest = new REST({ version: "10" }).setToken(process.env.BETA_TOKEN);
  } else if (clientEnviroment === "qa" || clientEnviroment === "staging") {
    if (!process.env.QA_STG_TOKEN) {
      console.error(
        chalk.red.bold("[TS-AUTH-ERR] ") + "🦀 Missing qa/staging authentication token."
      );
      process.exit(1);
    }
    rest = new REST({ version: "10" }).setToken(process.env.QA_STG_TOKEN);
  } else if (clientEnviroment === "production") {
    if (!process.env.PROD_TOKEN) {
      console.error(
        chalk.red.bold("[TS-AUTH-ERR] ") + "🦀 Missing production authentication token."
      );
      process.exit(1);
    }
    rest = new REST({ version: "10" }).setToken(process.env.PROD_TOKEN);   
  } else {
    console.error(
      chalk.red.bold("[TS-CORE-ERR] ") + "🍉 The enviroment was not configured correctly."
    );
    process.exit(1);
    return;
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
      const fileImport = require(filePath);
      const command = fileImport.default ?? fileImport;
      const commandData = command.data?.toJSON?.();
      if ("data" in command && "execute" in command) {
        client.slashCommands.set(commandData.name, command);
        commands.push(commandData);
      } else {
        skipped.push(path.basename(filePath));
      }
    }

    await rest.put(Routes.applicationCommands(config.client.clientId), {
      body: commands,
    });
    console.log(
      chalk.green.bold("[TS-CMD-SUCCESS] ") +
        `🐚 Successfully registered all ${clientEnviroment} (/) commands.`
    );

    if (skipped.length > 0) {
      console.warn(
        chalk.yellow.bold("[TS-CMD-WARN] ") +
          `🪼 Skipped ${skipped.length} invalid command(s): ${skipped.join(", ")}`
      );
    }
  } catch (error) {
    console.error(
      chalk.red.bold("[TS-CMD-ERR] ") +
        `🐚 Failed to register all ${clientEnviroment} (/) commands.`
    );
  }
}
