const fs = require('fs');

function commands(client) {
    const slash_commands = [];

    client.slashCommands.categories = [];
    // Load slash commands (interaction)
    fs.readdirSync('./commands/interaction').filter(f => !f.includes('.')).forEach(folder => {
        client.slashCommands.categories.push(folder);
        const commandFiles = fs.readdirSync(`./commands/interaction/${folder}`);
        for (const file of commandFiles) {
            const command = require(`../commands/interaction/${folder}/${file}`);
            if(!command) throw new Error(`cannot set commands ${file} is invalid!`);
            if(!command.name) command.name = file.split('.')[0];
            command.category = folder.split('.')[0];
            command.private = Boolean(command.private);
            client.slashCommands.set(command.name, command);
            slash_commands.push({
                name: command.name,
                description: command.description,
                options: command.options ? command.options : []
            });
        };
    });
    slashCommands(slash_commands); // Registering slash commands

    client.commands.categories = [];
    // Load commands (message)
    fs.readdirSync('./commands/message').filter(f => !f.includes('.')).forEach(folder => {
        client.commands.categories.push(folder);
        const commandFiles = fs.readdirSync(`./commands/message/${folder}`);
        for (const file of commandFiles) {
            const command = require(`../commands/message/${folder}/${file}`);
            if (!command) throw new Error(`cannot set commands ${file} is invalid!`);
            if (!command.name) command.name = file.split('.')[0];
            command.category = folder.split('.')[0];
            command.private = Boolean(command.private);
            client.commands.set(command.name, command);
        };
    });
    console.log('Message Commands: Reloaded...');
};

const { Routes } = require("discord-api-types/v10");
const { REST } = require('@discordjs/rest');
const config = require('../config.js');
/**
 * { Routes } from discord-api-types/v10
 * { REST } from @discordjs/rest
 * This is handlers for registering Slash Commands
 * */

async function slashCommands(data) {
    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
        console.log('Slash Commands: Refreshing...');
        await rest.put(
            Routes.applicationGuildCommands(
                config.slashRegister.clientId,
                config.slashRegister.guildId
            ), { body: data }
        );
    }
    catch(error) {
        return console.error('Slash Command Register:', error);
    }
    console.log('Slash Commands: Reloaded...');
};

module.exports = {
    load: commands,
    register: slashCommands
};
