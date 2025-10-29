"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const config = require("../config.json");
const clientEnviroment = config.client.enviroment;
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.MessageContent,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.Guilds,
    ],
});
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
    }
    else {
        console.warn(chalk.yellow.bold("[TS-HANDLER-WARN] ") +
            "🐢 Failed to load one or more handlers.");
    }
}
if (clientEnviroment === "beta") {
    if (!process.env.BETA_TOKEN) {
        console.error(chalk.red.bold("[TS-AUTH-ERR] ") + "🦀 Missing beta authentication token.");
        process.exit(1);
    }
    client.login(process.env.BETA_TOKEN);
}
else if (clientEnviroment === "qa" || clientEnviroment === "staging") {
    if (!process.env.QA_STG_TOKEN) {
        console.error(chalk.red.bold("[TS-AUTH-ERR] ") + "🦀 Missing qa/staging authentication token.");
        process.exit(1);
    }
    client.login(process.env.QA_STG_TOKEN);
}
else if (clientEnviroment === "production") {
    if (!process.env.PROD_TOKEN) {
        console.error(chalk.red.bold("[TS-AUTH-ERR] ") + "🦀 Missing production authentication token.");
        process.exit(1);
    }
    client.login(process.env.PROD_TOKEN);
}
else {
    console.error(chalk.red.bold("[TS-CORE-ERR] ") + "🍉 The enviroment was not configured correctly.");
    process.exit(1);
}
