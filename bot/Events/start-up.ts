import * as chalk from "chalk";
import * as mongoose from "mongoose";
import "dotenv/config";
import { Client } from "discord.js";
module.exports = {
  event: "ready",
  once: true,
  execute: async (client: Client) => {
    console.log(
      chalk.cyan.bold("[TS-CORE-INFO] ") + "🐚 Bot starting up..."
    );
    try {
      if (!process.env.MONGODB_URI) {
        console.error(
          chalk.red.bold("[TS-DB-ERR] ") + "🪨 Database connection failed."
        );
        process.exit(1);
      }
      mongoose.connect(process.env.MONGODB_URI);
      console.log(
        chalk.green.bold("[TS-DB-SUCCESS] ") + "🐬 Database connection established."
      );
      console.log(
        chalk.green.bold("[TS-CORE-SUCCESS] ") + "🌴 Crab (production) is online!"
      );
    } catch (error) {
      console.error(
        chalk.red.bold("[TS-CORE-ERR] ") + "🪸 Failed to initialize core modules."
      );
      process.exit(1);
    }
  },
};
