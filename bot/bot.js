const { Client, IntentsBitField } = require('discord.js')
require('dotenv').config()
const fs = require('fs');
const handlers = fs.readdirSync('bot/Handlers').filter(file => file.endsWith('.js'));
const client = new Client({
    intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.Guilds],
})
for (const handler of handlers) {
    require(`./Handlers/${handler}`)(client);
}
client.login(process.env.TOKEN)
console.log(`🦀 Logged in as Crab!`)