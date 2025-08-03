const fs = require('fs')
const path = require('path')

module.exports = (client) => {
  const prefixPath = path.join(__dirname, '..', 'Commands', "Prefix")
  const prefixFolder = fs.readdirSync(prefixPath).filter(command => command.endsWith(".js"))

  client.prefixCommands = new Map()

  try {
    for (const File of prefixFolder) {
      const PrefixFilePath = path.join(__dirname, '../Commands/Prefix', File);
      const PrefixFile = require(PrefixFilePath)
      client.prefixCommands.set(PrefixFile.command, PrefixFile)
      if (PrefixFile.aliases && Array.isArray(PrefixFile.aliases)) {
        for (const alias of PrefixFile.aliases) {
          client.prefixCommands.set(alias.toLowerCase(), PrefixFile)
        }
      }
    }
  } catch (error) {
    console.error(`An error occured in the prefix handler.`, error)
  }
}
