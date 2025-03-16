const { Client, IntentsBitField } = require('discord.js')
require('dotenv').config()
const fs = require('fs');
const mongoose = require('mongoose')
const handlers = fs.readdirSync('bot/Handlers').filter(file => file.endsWith('.js'));
const client = new Client({
    intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.Guilds],
})
for (const handler of handlers) {
    require(`./Handlers/${handler}`)(client);
}
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🌺 Connected to DB.");
    client.login(process.env.TOKEN)
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();

console.log(`🦀 Logged in as Crab!`)
