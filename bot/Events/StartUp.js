const wipeShifts = require("../Functions/wipeShifts");
const mongoose = require("mongoose");
const chalk = require("chalk")
module.exports = {
  event: 'ready',
  once: true,
  execute: async (client) => {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log(chalk.green("[SYSTEM] 🌺 Connected to DB."));
      console.log(chalk.green(`[SYSTEM] 🦀 Logged in as ${client.user.username}`));
      wipeShifts(); 
    } catch (error) {
      console.error(chalk.red("[SYSTEM] ❌ Startup error:", error));
      process.exit(1);
    }
  }
};
