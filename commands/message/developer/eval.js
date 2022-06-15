const Discord = require("discord.js");
const EmbedPagination = require('../../../utils/embedPagination');
const chunk = require('../../../utils/chunk');

module.exports = {
    name: "eval",
    description: "Evalue JavaScript Code",
    usage: "<string>",
    private: true,
    execute: async (client, message) => {
        const embed = new Discord.EmbedBuilder();

        try {
            let code = message.arguments.join(" ");
            if(!code) return message.reply("Missing arguments! Please include the code.");

            let evaled = await eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled, { depth: 0 });

            let output = clean(evaled);
                embed.setDescription("```js\n" + output + "```")
                embed.setColor('Blue');

            const embeds = chunk.string(String(output)).map(newOutput => new Discord.EmbedBuilder().setDescription('```js\n'+newOutput+'```').setColor('Blue'));
            new EmbedPagination({ ctx: message, embeds }).start();
        } 
        catch (Error){
            let error = clean(Error);
                embed.setDescription("```js\n" + error + "```")
                embed.setTitle("Error!")
                embed.setColor("Red");

            message.reply({ embeds: [embed] });
        }
    },
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
