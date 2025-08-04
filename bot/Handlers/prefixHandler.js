const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const prefixPath = path.join(__dirname, '..', 'Commands', 'Prefix');
  const prefixFiles = fs.readdirSync(prefixPath).filter(file => file.endsWith(".js"));

  client.prefixCommands = new Map();

  for (const file of prefixFiles) {
    const filePath = path.join(prefixPath, file);
    const commandFile = require(filePath);
    if (!commandFile.command) continue;
    
    client.prefixCommands.set(commandFile.command, commandFile);
    
    if (Array.isArray(commandFile.aliases)) {
      for (const alias of commandFile.aliases) {
        client.prefixCommands.set(alias.toLowerCase(), commandFile);
      }
    }
  }
};
