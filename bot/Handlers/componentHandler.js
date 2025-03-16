const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const selectMenuPath = path.join(__dirname, '..', 'Components', 'SelectMenus');
    const SelectMenusFolder = fs.readdirSync(selectMenuPath).filter(command => command.endsWith(".js"));
    const buttonPath = path.join(__dirname, '..', 'Components', 'Buttons');
    const ButtonsFolder = fs.readdirSync(buttonPath).filter(command => command.endsWith(".js"));
    const userButtonPath = path.join(__dirname, '..', 'Components', 'UserSpecificButtons');
    const UserButtonFolder = fs.readdirSync(userButtonPath).filter(command => command.endsWith(".js"));
    const modalPath = path.join(__dirname, '..', 'Components', 'Modals');
    const ModalsFolder = fs.readdirSync(modalPath).filter(command => command.endsWith(".js"));
    
    client.buttons = new Map();
    client.userButtons = new Map()
    client.selectMenus = new Map();
    client.modals = new Map();
    try {
        for (const File of SelectMenusFolder) {
            const SelectMenuFilePath = path.join(__dirname, '../Components/SelectMenus', File);
            const SelectMenuFile = require(SelectMenuFilePath);
            client.selectMenus.set(SelectMenuFile.customId, SelectMenuFile);
        };
    
        for (const File of ButtonsFolder) {
            const ButtonsFilePath = path.join(__dirname, '../Components/Buttons', File);
            const ButtonsFile = require(ButtonsFilePath);
    
            client.buttons.set(ButtonsFile.customId, ButtonsFile);
        };
            
        for (const File of ModalsFolder) {
            const ModalsFilePath = path.join(__dirname, '../Components/Modals', File);
            const ModalsFile = require(ModalsFilePath);
    
            client.modals.set(ModalsFile.customId, ModalsFile);
        };
        
        for (const File of UserButtonFolder) {
          const UserButtonsFilePath = path.join(__dirname, '../Components/UserSpecificButtons', File);
          const UserButtonsFile = require(UserButtonsFilePath);

          client.userButtons.set(UserButtonsFile.customIdPrefix, UserButtonsFile)
        }
    } catch (error) {
        console.log(`There was an error while running the Component Handler.\nError: ${error}`);
    };
};
