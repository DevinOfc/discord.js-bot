module.exports = async(client) => {
    // Bot presence
    client.user.setPresence({
        activities: [{
            type: 0, // Playing
            name: `Made with ❤ by Devin#3583`
        }],
        status: 'online'
    });

    // This is log when your Bot is ready and have login to Discord
    console.log(`Ready: Connected to ${client.user.tag}!`);
    client.webhook.send({ content: `${client.user} is Ready!` });
};
