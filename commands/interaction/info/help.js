const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Check commands list',
    execute: async (client, interaction) => {
        await interaction.deferReply();
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setAuthor({ name: `${client.user.username} Help`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription('This is my available commands list.');
        for (const category of client.slashCommands.categories) {
            const commands = client.slashCommands.filter(cmd => cmd.category == category);
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            const commandList = commands.map(command => `\`${command.name}\``).join(', ');
            embed.fields.push({ name: `${categoryName} commands`, value: commandList });
        };
        interaction.editReply({ embeds: [embed] });
    }
};
