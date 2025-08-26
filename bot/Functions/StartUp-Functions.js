const mongoose = require("mongoose")
const axios = require("axios")
const chalk = require("chalk")
require('dotenv').config()
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes

if (!process.env.DB_HEARTBEAT_URL) {
    throw new Error("DB_HEARTBEAT_URL is not defined in the config file.");
}

const DB_HEARTBEAT_URL = process.env.DB_HEARTBEAT_URL;

async function startStayAliveDb() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MongoDB URI is not defined in the config file.");
    }

    try {
      await mongoose.connect(process.env.MONGODB_URI)
        console.log(chalk.green("[System]: Connected to MongoDB successfully."))
        // Immediately send first heartbeat
        await sendHeartbeat(DB_HEARTBEAT_URL, "database");
        // Schedule recurring heartbeat
        setInterval(() => sendHeartbeat(DB_HEARTBEAT_URL, "database"), PING_INTERVAL);

    } catch (err) {
        console.error(chalk.red("[System]: Failed to connect to MongoDB", err))
        process.exit(1);
    }
}

async function sendHeartbeat(url, type) {
    console.log(`Pinging BetterStack (${type})...`);
    try {
        await axios.get(url);
        console.log(chalk.green(`Successfully pinged BetterStack (${type})`));
    } catch (error) {
        console.error(chalk.red(`Failed to ping BetterStack (${type}):`, error));
    }
}

module.exports = startStayAliveDb, sendHeartbeat