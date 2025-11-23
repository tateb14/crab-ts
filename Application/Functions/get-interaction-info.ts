function getInteractionInfo(interaction: any): string {
    if (interaction.isCommand?.()) {
        return `Slash Command: </${interaction.commandName}:${interaction.commandId}>`;
    } else if (interaction.isButton?.()) {
        return `Button Interaction: ${interaction.customId}`;
    } else if (interaction.isModalSubmit?.()) {
        return `Modal Submission: ${interaction.customId}`;
    } else if (interaction.isAnySelectMenu?.()) {
        return `Select Menu: ${interaction.customId || interaction.values[0]}`;
    } else if (interaction.isAutocomplete?.()) {
        return `Autocomplete: ${interaction.commandName}`;
    }
    return "Unknown interaction type";
}
