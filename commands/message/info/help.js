const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } = require('discord.js');
const categoryEmoji = {
    info: 'ℹ️'
};

module.exports = {
    name: 'help',
    description: 'Check commands list',
    execute: async (client, message) => {
        const buttons = [];
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setAuthor({ name: `${client.user.username} Help`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription('This is my available commands list.')
            .setFields([]);
        const categories = client.commands.categories.filter(category => category !== 'developer');
        for (const category of categories) {
            const commands = client.commands.filter(cmd => cmd.category == category);
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            const commandList = commands.map(command => `\`${command.name}\``).join(', ');
            embed.data.fields.push({ name: `${categoryEmoji[category]} ${categoryName} Commands`, value: commandList });
            buttons.push(
                new ButtonBuilder()
                    .setCustomId(category)
                    .setEmoji(categoryEmoji[category])
                    .setStyle('Secondary')
            );
        };
        const actionRow = new ActionRowBuilder().addComponents(buttons);
        message.reply({ embeds: [embed], components: [actionRow] }).then(m => createInteractionCollector(m));
    }
};

function createInteractionCollector(m) {
    const client = m.client;
    const category = client.commands.categories;
    const commands = Array.from(client.commands.keys());
    const embed = new EmbedBuilder().setColor('Blurple');
    const collector = m.createMessageComponentCollector({
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
                .setPlaceholder('Select spesific commands by name for more information');
            const menuOptions = [];
            commandData.forEach(command => {
                menuOptions.push({ label:  command.name, description: command.description, value: command.name });
            });
            embed.setTitle(`${categoryEmoji[value]} ${categoryName} Commands`).setDescription(commandList);
            menu.addOptions(menuOptions);
            const actionRow = new ActionRowBuilder().addComponents([menu]);
            interaction.editReply({ embeds:[embed], components: [actionRow] });
        }
        else if(interaction.isSelectMenu()){
            interaction.deferUpdate();
        }
    });
    collector.on('end', () => {
        if(!m) return;
        const newEmbed = EmbedBuilder.from(m.embeds[0]);
        newEmbed.setColor('LightGrey');
        const oldActionRow = m.components[0];
        const newActionRow = new ActionRowBuilder();
        const newButtons = [];
        oldActionRow.components[0].forEach(oldButton => {
            oldButton = ButtonBuilder.from(oldButton);
            oldButton.setDisabled(true);
            newButtons.push(oldButton);
        });
        newActionRow.addComponents(newButton);
        m.edit({ embeds: [newEmbed], components: [newActionRow] }).catch(_=>void 0);
    });
    return collector;
};
