const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    client.on('interactionCreate', (interaction) => {
        if (interaction.isAnySelectMenu()) {
            const SelectMenuFolder = fs.readdirSync('../Components/SelectMenus').filter(component => component.endsWith(".js"));

            for (const File of SelectMenuFolder) {
                const SelectMenuFilePath = path.join(__dirname, '../Components/SelectMenus', File);
                const SelectMenuModule = require(SelectMenuFilePath);

                if (SelectMenuModule.customId === interaction.customId) {
                    SelectMenuModule.response(interaction);
                }
            }
        }
        if (interaction.isButton()){
            const ButtonFolder = fs.readdirSync('../Components/Buttons').filter(component => component.endsWith(".js"));;
            for (const File of ButtonFolder) {
                const ButtonFilePath = path.join(__dirname, '../Components/Buttons', File);
                const ButtonModule = require(ButtonFilePath);

                if (ButtonModule.customId === interaction.customId) {
                    ButtonModule.response(interaction);
                }
            }
        }
        if (interaction.isModalSubmit()) {
            const ModalFolder = fs.readdirSync('../Components/Modals').filter(component => component.endsWith(".js"));
            for (const File of ModalFolder) {
                const ModalFilePath = path.join(__dirname, '../Components/Modals', File);
                const ModalModule = require(ModalFilePath);

                if (ModalModule.customId === interaction.customId) {
                    ModalModule.response(interaction);
                }
            }
        }
    })
}
