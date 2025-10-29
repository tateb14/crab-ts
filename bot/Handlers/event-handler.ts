import { Client } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";

module.exports = (client: Client) => {
  const eventFolder = path.join(__dirname, "../Events");
  const eventFiles = fs
    .readdirSync(path.join(eventFolder))
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const eventFile of eventFiles) {
    const filePath = path.join(eventFolder, eventFile);
    const eventModule = require(filePath);
    const eventData = eventModule.default ?? eventModule;
    try {
      if (eventData.once) {
        client.once(eventModule.event, (...args) =>
          eventModule.execute(client, ...args)
        );
      } else {
        client.on(eventModule.event, (...args) =>
          eventModule.execute(client, ...args)
        );
      }
    } catch (error) {
      console.error(
        chalk.red.bold("[TS-EVENT-ERR] ") +
          `🪸 Failed to load event: ${chalk.yellow(eventFile)}`
      );
      console.error(error);
    }
  }
  console.log(
    chalk.green.bold("[TS-EVENT-SUCCESS] ") +
    `🦀 Successfully registered ${eventFiles.length} event(s).`
  );
};
