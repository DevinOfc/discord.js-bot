const Discord = require('discord.js');

module.exports = {
    name: 'eval',
    description: 'Evaluate JavaScript Code',
    options: [{
        name: 'code',
        description: 'JavaScript Code',
        required: true,
        type: Discord.ApplicationCommandOptionType.String
    }],
    execute: async (client, interaction) => {
        const embed = new Discord.EmbedBuilder();
        const code = interaction.options.getString('code');
        try{
            await interaction.deferReply();

            let evaled = await eval(code);
            if (typeof evaled !== "string")
                evaled = await require("util").inspect(evaled, { depth: 0 });

            let output = clean(evaled);
                embed.setDescription("```js\n" + output + "```")
                embed.setColor('Blue');

            await interaction.editReply({ embeds: [embed] });
        } 
        catch (error){
            error = clean(error);
                embed.setDescription("```js\n" + error + "```")
                embed.setTitle("Error!")
                embed.setColor("Red");

            await interaction.editReply({ embeds: [embed] });
        };
    }
};

function clean(values) {
    if(typeof values === "string") {
        return values
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    }
    else{
        return values;
    }
};
