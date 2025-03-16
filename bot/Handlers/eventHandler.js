const fs = require('fs')
const path = require('path')

module.exports = (client) => {
    const EventFolder = path.join(__dirname, '../Events')
    const EventFiles = fs.readdirSync(path.join(EventFolder)).filter(file => file.endsWith('.js'))

    for (const File of EventFiles) {
        const FilePath = path.join(EventFolder, File)
        const EventModule = require(FilePath);
        try {
            if (File.once) {
                client.once(EventModule.event, (...args) => EventModule.execute(client, ...args));
            } else {
                client.on(EventModule.event, (...args) => EventModule.execute(client, ...args));
            }
        } catch (error) {
            console.error('🍹 Event Handler: There was an error:', error)
        }
    }
}
