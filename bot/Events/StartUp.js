const wipeShifts = require("../Functions/wipeShifts");
const mongoose = require("mongoose");
const chalk = require("chalk")
require('dotenv').config()
const { startStayAliveDb, sendHeartbeat } = require("../Functions/StartUp-Functions")
module.exports = {
  event: 'ready',
  once: true,
  execute: async (client) => {
    const TROPICA_HEARTBEAT_URL = process.env.BOT_STATUS_URL
    try {
      sendHeartbeat(TROPICA_HEARTBEAT_URL, "Tropica");
      setInterval(() => sendHeartbeat(TROPICA_HEARTBEAT_URL, "Crab"), 5 * 60 * 1000);

      (async () => await startStayAliveDb())();

      console.log(chalk.green("[SYSTEM] 🌺 Connected to DB."));
      console.log(chalk.green(`[SYSTEM] 🦀 Logged in as ${client.user.username}`));
      wipeShifts(); 
    } catch (error) {
      console.error(chalk.red("[SYSTEM] ❌ Startup error:", error));
      process.exit(1);
    }
  }
};
