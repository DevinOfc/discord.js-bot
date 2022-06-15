const Discord = require('discord.js');
const EmbedPagination = require('../../../utils/embedPagination');
const chunk = require('../../../utils/chunk');

module.exports = {
    name: 'eval',
    description: 'Evaluate JavaScript Code',
    options: [{
        name: 'code',
        description: 'JavaScript Code',
        required: true,
        type: Discord.ApplicationCommandOptionType.String
    }],
    private: true,
    execute: async (client, interaction) => {
        const embed = new Discord.EmbedBuilder();
        const code = interaction.options.getString('code');
        try{
            let evaled = await eval(code);
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled, { depth: 0 });

            let output = clean(evaled);
                embed.setDescription("```js\n" + output + "```")
                embed.setColor('Blue');

            if(interaction.replied) {
                interaction.followUp({ embeds: [embed] });
            }
            else{
                const embeds = chunk.string((output).toString()).map(newOutput => new Discord.EmbedBuilder().setDescription('```js\n'+newOutput+'```').setcolor('Blue'));
                new EmbedPagination({ ctx: interaction, embeds }).start();
            };
        } 
        catch (error){
            error = clean(error);
                embed.setDescription("```js\n" + error + "```")
                embed.setTitle("Error!")
                embed.setColor("Red");

            if(interaction.replied) {
                interaction.followUp({ embeds: [embed] });
            }
            else{
                interaction.reply({ embeds: [embed] });
            }
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
