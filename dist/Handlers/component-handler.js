"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
module.exports = (client) => {
    const selectMenuPath = path.join(__dirname, "..", "Components", "Menus");
    const selectMenusFolder = fs.readdirSync(selectMenuPath).filter((command) => command.endsWith(".ts") || command.endsWith(".js"));
    const buttonPath = path.join(__dirname, "..", "Components", "Buttons");
    const buttonsFolder = fs.readdirSync(buttonPath).filter((command) => command.endsWith(".ts") || command.endsWith(".js"));
    const modalPath = path.join(__dirname, "..", "Components", "Modals");
    const modalsFolder = fs.readdirSync(modalPath).filter((command) => command.endsWith(".ts") || command.endsWith(".js"));
    client.buttons = new Map();
    client.selectMenus = new Map();
    client.modals = new Map();
    try {
        for (const selectMenuFile of selectMenusFolder) {
            const selectMenuFilePath = path.join(__dirname, "../Components/Menus", selectMenuFile);
            const selectMenuFileData = require(selectMenuFilePath);
            client.selectMenus.set(selectMenuFileData.customId, selectMenuFileData);
        }
        ;
        for (const buttonsFile of buttonsFolder) {
            const buttonsFilePath = path.join(__dirname, "../Components/Buttons", buttonsFile);
            const buttonFile = require(buttonsFilePath);
            client.buttons.set(buttonFile.customId, buttonFile);
        }
        ;
        for (const modalsFile of modalsFolder) {
            const modalsFilePath = path.join(__dirname, "../Components/Modals", modalsFile);
            const modalFile = require(modalsFilePath);
            client.modals.set(modalFile.customId, modalFile);
        }
        ;
    }
    catch (error) {
        console.log(`There was an error while running the Component Handler.\nError: ${error}`);
    }
    ;
};
