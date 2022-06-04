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
    await interaction.deferUpdate({ ephemeral: true });
    await interaction.editReply(`Received select menu interaction of '${interaction.customId}'`);
    const values = interaction.values;
    if (values[0]) interaction.followUp(`Received clicked the select menu ${values[0]}`);
};
