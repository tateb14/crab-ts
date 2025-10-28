import { Client, IntentsBitField } from "discord.js";
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";
import { SlashCommand } from "./Types/slash-command-interface";
const client = new Client({
  intents: [
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.Guilds,
  ],
});

// Define client
declare module "discord.js" {
  interface Client {
    slashCommands: Map<string, SlashCommand>;
    buttons: Map<string, Function>;
    menus: Map<string, Function>;
    modals: Map<string, Function>;
  }
}
// Define maps
client.slashCommands = new Map();
client.buttons = new Map();
client.menus = new Map();
client.modals = new Map();
// Load handlers
const handlersPath = path.join(__dirname, "Handlers");
const handlers = fs
  .readdirSync(handlersPath)
  .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
for (const handler of handlers) {
  const handlerPath = path.join(handlersPath, handler);
  const handlerModule = require(handlerPath);
  const load = handlerModule.default ?? handlerModule;
  if (typeof load === "function") {
    load(client);
  } else {
    console.warn(
      chalk.yellow.bold("[TS-HANDLER-WARN] ") +
        "🐢 Failed to load one or more handlers."
    );
  }
}

if (!process.env.TOKEN) {
  console.error(
    chalk.red.bold("[TS-AUTH-ERR] ") +
      "🦀 Missing Discord bot token."
  );
  process.exit(1);
}
client.login(process.env.TOKEN);
