const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Check commands list',
    execute: async (client, message) => {
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setAuthor({ name: `${client.user.username} Help`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription('This is my available commands list.')
            .setFields([]);
        for (const category of client.commands.categories) {
            const commands = client.commands.filter(cmd => cmd.category == category);
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            const commandList = commands.map(command => `\`${command.name}\``).join(', ');
            embed.data.fields.push({ name: `${categoryName} commands`, value: commandList });
        };  
        message.reply({ embeds: [embed] });
    }
};
