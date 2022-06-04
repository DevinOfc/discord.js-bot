const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } = require('discord.js');
const categoryEmoji = require('../emoji.json');

module.exports = {
    name: 'help',
    description: 'Check commands list',
    execute: async (client, interaction) => {
        const buttons = [];
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setAuthor({ name: `${client.user.username} Help`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription('This is my available commands list.')
            .setFields([]);
        const categories = client.slashCommands.categories.filter(category => category !== 'developer');
        for (const category of categories) {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            const commandList = client.slashCommands.filter(cmd => cmd.category == category).map(command => `\`${command.name}\``).join(', ');
            embed.data.fields.push({ name: `${categoryEmoji[category]} ${categoryName} Commands`, value: commandList });
            buttons.push(
                new ButtonBuilder()
                    .setCustomId(category)
                    .setEmoji(categoryEmoji[category])
                    .setStyle('Secondary')
            );
        };
        const actionRow = new ActionRowBuilder().addComponents(buttons);
        interaction.reply({ embeds: [embed], components: [actionRow], fetchReply: true }).then(i => createInteractionCollector(i));
    }
};

function createInteractionCollector(i) {
    const client = i.client;
    const category = client.slashCommands.categories;
    const commands = Array.from(client.slashCommands.keys());
    const embed = new EmbedBuilder().setColor('Blurple');
    const collector = i.createMessageComponentCollector({
        filter: (interaction) => category.includes(interaction.customId) || commands.includes(interaction.customId),
        time: 60000
    });
    collector.on('collect', async(interaction) => {
        await interaction.deferReply({ ephemeral: true });
        collector.resetTimer({ time: 60000, idle: 60000 });
        const value = interaction.customId;

        if(interaction.isButton()){
            const categoryName = value.charAt(0).toUpperCase() + value.slice(1);
            const commandData = client.commands.filter(cmd => cmd.category === value);
            const commandList = commandData.map(command => `\`${command.name}\``).join(', ');
            const menu = new SelectMenuBuilder()
                .setCustomId(value)
                .setPlaceholder('Select spesific commands for information');
            const menuOptions = [];
            commandData.forEach(command => {
                menuOptions.push({ label:  command.name, description: command.description, value: command.name });
            });
            menu.addOptions(menuOptions);
            const actionRow = new ActionRowBuilder().addComponents([menu]);
            embed.setTitle(`${categoryEmoji[value]} ${categoryName} Commands`).setDescription(commandList);
            interaction.editReply({ embeds:[embed], components: [actionRow] });
        }
    });
    collector.on('end', () => {
        if(!i) return;
        const oldActionRow = i.components[0];
        const newActionRow = new ActionRowBuilder();
        const newButtons = ButtonBuilder.from(oldActionRow.components[0]);
        newButtons.setDisabled(true);
        newActionRow.addComponents([newButtons]);
        i.edit({ components: [newActionRow] }).catch(_=>void 0);
    });
    return collector;
};
