const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Check commands list',
    execute: async (client, interaction) => {
        await interaction.deferReply();
        const commands = client.slashCommands.toJSON();
        const commandList = commands.map(command => `\`${command.name}\``).join(', ');
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setAuthor({ name: `${client.user.username} Help`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription('This is my available commands list.')
            .addFields([
                { name: '\u200B', value: commandList }
            ]);
        interaction.editReply({ embeds: [embed] });
    }
};
