const Discord = require('discord.js');
const client = new Discord.Client({
    allowedMentions: {
        parse: ['users', 'roles', 'everyone'],
        repliedUser: false
    },
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
});

// client configuration
client.commands = new Discord.Collection();
client.config = require('./config.js');
client.slashCommands = new Discord.Collection();
client.webhook = new Discord.WebhookClient({url:'https://discord.com/api/webhooks/901065114315292752/miZW_rw-j1DQ1YzQxh0_Ejms-_z1nrz09Vae4VoyT2U3TpRbSmH3akpg-exmu2SDHoRb'});

client.on('error', (error) => {
    console.error(error); 
    client.webhook.send(`\`\`\`js\n${error}\`\`\``)
});
client.on('warn', (info) => console.log(info));

// loaded all handlers
const fs = require('fs');
fs.readdirSync('./handlers').forEach(file => require(`./handlers/${file}`).load(client));

// catching node error to handle & anticipation system crash
process.on('uncaughtException', (error) => console.error(error));
process.on('unhandledRejection', (error) => console.error(error));

client.login(client.config.token); // Login to Discord with your Bot TOKEN

module.exports = client;
