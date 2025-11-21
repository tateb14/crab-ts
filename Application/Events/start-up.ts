import * as chalk from "chalk";
import * as mongoose from "mongoose";
import "dotenv/config";
import * as config from "../../config.json";
import { Client } from "discord.js";
module.exports = {
    event: "clientReady",
    once: true,
    execute: async (client: Client) => {
        try {
            const clientEnviroment = config.client.enviroment;
            console.log(
                chalk.cyan.bold("[TS-CORE-INFO] ") +
                    "🐚 Beginning start up procedures..."
            );
            console.log(
                chalk.cyan.bold("[TS-CORE-INFO] ") +
                    `🏝️ Starting up in the ${clientEnviroment} enviroment...`
            );
            // Handle database connection
            if (clientEnviroment !== "production") {
                //? Check URI
                if (!process.env.MONGO_URI_DEV) {
                    throw new Error(
                        chalk.red.bold("[TS-DB-ERR] ") +
                            "🪨 Development database connection failed."
                    );
                }
                //? Connect to DB
                
                await mongoose.connect(process.env.MONGO_URI_DEV);
                console.log(
                    chalk.green.bold("[TS-DB-SUCCESS] ") +
                        "🐬 Development database connection established."
                );
            } else {
                //? Check URI
                if (!process.env.MONGODB_URI_PROD) {
                    throw new Error(
                        chalk.red.bold("[TS-DB-ERR] ") +
                            "🪨 Production database connection failed."
                    );
                }
                //? Connect to DB
                await mongoose.connect(process.env.MONGODB_URI_PROD);
                console.log(
                    chalk.green.bold("[TS-DB-SUCCESS] ") +
                        "🐬 Production database connection established."
                );
            }

            console.log(
                chalk.green.bold("[TS-CORE-SUCCESS] ") +
                    `🌴 ${client.user!.username} (${
                        config.client.enviroment
                    }) is online!`
            );
        } catch (error) {
            throw new Error(
                chalk.red.bold("[TS-CORE-ERR] ") +
                    "🪸 Failed to initialize core modules." +
                    error
            );
        }
    },
};
