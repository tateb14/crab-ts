import { Client, IntentsBitField } from "discord.js";
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";
import { SlashCommand } from "./Types/slash-command-interface";
import * as config from "../config.json";
import { ModalInterface } from "./Types/modal-interface";
import { SelectMenuInterface } from "./Types/menu-interface";
import { ButtonInterface } from "./Types/button-interface";
import { PrefixCommand } from "./Types/prefix-command-interface";

const clientEnviroment = config.client.enviroment;
const client = new Client({
  intents: [
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.Guilds,
  ],
});

//? Define client
declare module "discord.js" {
  interface Client {
    slashCommands: Map<string, SlashCommand>;
    buttons: Map<string, ButtonInterface>;
    selectMenus: Map<string, SelectMenuInterface>;
    modals: Map<string, ModalInterface>;
    prefixCommands: Map<string, PrefixCommand>;
  }
}
//? Define maps
client.slashCommands = new Map();
client.buttons = new Map();
client.selectMenus = new Map();
client.modals = new Map();
client.prefixCommands = new Map();
//? Load handlers
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

if (clientEnviroment === "beta") {
  if (!process.env.BETA_TOKEN) {
    throw new Error(
      chalk.red.bold("[TS-AUTH-ERR] ") + "🦀 Missing beta authentication token."
    );
  }
  client.login(process.env.BETA_TOKEN);
} else if (clientEnviroment === "qa" || clientEnviroment === "staging") {
  if (!process.env.QA_STG_TOKEN) {
    throw new Error(
      chalk.red.bold("[TS-AUTH-ERR] ") +
        "🦀 Missing qa/staging authentication token."
    );
  }
  client.login(process.env.QA_STG_TOKEN);
} else if (clientEnviroment === "production") {
  if (!process.env.PROD_TOKEN) {
    throw new Error(
      chalk.red.bold("[TS-AUTH-ERR] ") +
        "🦀 Missing production authentication token."
    );
  }
  client.login(process.env.PROD_TOKEN);
} else {
  throw new Error(
    chalk.red.bold("[TS-CORE-ERR] ") +
      "🍉 The enviroment was not configured correctly."
  );
}
