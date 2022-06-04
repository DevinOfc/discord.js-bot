const { EmbedBuilder } = require('discord.js');
const commandCategoryEmoji = require('../commands/interaction/emoji.json');

module.exports = (client, interaction) => {
    if (!interaction.isChatInputCommand()) {
        if (interaction.isSelectMenu()) selectMenuInteraction(client, interaction);
        return;
    };

    const slashCommand = client.slashCommands.get(interaction.commandName);
    if (!slashCommand) return client.slashCommands.delete(interaction.commandName);
    try {
        slashCommand.execute(client, interaction);
    }
    catch(error) {
        console.error(error);
    }
};

async function selectMenuInteraction(client, interaction) {
    await interaction.deferUpdate();
    if (client.slashCommands.categories.includes(interaction.customId)) {
        const command = client.slashCommands.get(interaction.values[0]);
        if (!command) return interaction.followUp({ content: `Cannot find the commands!`, ephemeral: true });
        const categoryName = command.category.charAt(0).toUpperCase() + command.category.slice(1);
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle(command.name)
            .setDescription(command.description)
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/microsoft/310/information_2139-fe0f.png')
            .addFields([
                { name: '\u200B', value: '\u200B' }
            ])
            .setFooter({ text: `${commandCategoryEmoji[command.category]} ${categoryName} Commands` })
        await interaction.followUp({ embeds: [embed], ephemeral: true });
    };
};
