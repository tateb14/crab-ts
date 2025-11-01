import { Client } from "discord.js";
import * as fs from "fs";
import * as path from "path";

export default async function (client: Client) {
  const prefixPath = path.join(__dirname, '..', 'Commands', 'Prefix');
  const prefixFiles = fs.readdirSync(prefixPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  client.prefixCommands = new Map();

  for (const prefixFile of prefixFiles) {
    const prefixFilePath = path.join(prefixPath, prefixFile);
    const prefixCommandFile = require(prefixFilePath);
    if (!prefixCommandFile.command) continue;
    
    client.prefixCommands.set(prefixCommandFile.command, prefixCommandFile);
    
    if (Array.isArray(prefixCommandFile.aliases)) {
      for (const prefixAlias of prefixCommandFile.aliases) {
        client.prefixCommands.set(prefixAlias.toLowerCase(), prefixCommandFile);
      }
    }
  }
};
