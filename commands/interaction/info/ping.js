module.exports = {
    name: 'ping',
    description: 'Check bot latency',
    execute: async (client, interaction) => {
        await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const now = await Date.now();

        interaction.editReply({ content: `Pong!: **${now-interaction.createdTimestamp}** ms` });
    }
};
