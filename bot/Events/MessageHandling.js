module.exports = {
  event: 'messageCreate',
  once: false,
  execute: async (client, message) => {
    const prefix = "c."
    if (message.content.startsWith("c.")) {
      const args = message.content.split(prefix).splice(1)
      const Message = args[0]
      const Command = client.prefixCommands.get(Message)
      try {
        if (!Command) {
          return;
        }
        Command.execute(message, client)
      } catch (error) {
        message.reply({ content: 'There was an error while trying to execute this command!' });
        console.log(`There was an error while executing a slash command interaction!\nError: ${error}`);
      }
    }
    

  }
}
