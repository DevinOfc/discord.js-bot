module.exports = (client, message) => {
    if (message.author.bot) return;

    const prefix = client.config.prefix.toLowerCase();
    const content = message.content.toLowerCase();
    if (!content.startsWith(prefix)) return;

    message.arguments = message.content.slice(prefix.length).trim().split(/ +/g) || [];
    const cmd = message.arguments.shift().toLowerCase();
    if (cmd.length == 0) return;

    const command = client.commands.get(cmd);
    if (!command) return;
    if (command.category == 'developer' && message.author.id !== client.config.developerId) return;
    if (command.private && message.author.id !== client.config.developerId) return;
    try {
        command.execute(client, message);
    }
    catch(error) {
        console.error(error);
    }
};
