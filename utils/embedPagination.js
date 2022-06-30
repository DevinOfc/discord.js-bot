const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = class EmbedPagination {
    constructor(options={}) {
        options = {
            ctx: options.ctx,
            embeds: options.embeds,
            collector: {
                filter: options.collector ? options.collector.filter : i => i.deferUpdate().catch(() => null) && !i.user.bot && i.user.id === options.ctx.member.user.id,
                timeout: options.collector ? (!isNaN(options.collector.timeout) ? options.collector.timeout : 60 * 1000) : 60 * 1000
            }
        };

        this.ctx = options.ctx;
        this.collector = options.collector;

        this.buttons = {
            left: (d) => new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId("pagination:left").setEmoji({name: "◀️"}).setDisabled(!!d),
            trash: (d) => new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId("pagination:trash").setEmoji({name: "❌"}).setDisabled(!!d),
            right: (d) => new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId("pagination:right").setEmoji({name: "▶️"}).setDisabled(!!d)
        };
        this.embeds = options.embeds;
    }
    get buttonList() {
        if (this.page === 0) return [this.buttons.left(true), this.buttons.trash(), this.buttons.right()];
        if (this.page === this.embeds.length - 1) return [this.buttons.left(), this.buttons.trash(), this.buttons.right(true)];
        else return [this.buttons.left(), this.buttons.trash(), this.buttons.right()];
    }
    get page() {
        return [];
    }

    controlHandler(button, message) {
        const row = new ActionRowBuilder();

        switch (button.customId) {
            case "pagination:left": {
                const newButtons = [];
                if (this.embeds[this.page - 1]) message.edit({
                    embeds: [this.embeds[--this.page]],
                    components: [(() => {
                        for (let button of this.buttonList) newButtons.push(button);
                        row.addComponents(newButtons);
                        return row;
                    })()]
                }).catch(_ => void 0);
                break;
            }

            case "pagination:trash": {
                message.delete().catch(_ => void 0);
                break;
            }

            case "pagination:right": {
                const newButtons = [];
                if (this.embeds[this.page + 1]) message.edit({
                    embeds: [this.embeds[++this.page]],
                    components: [(() => {
                        for (let button of this.buttonList) newButtons.push(button);
                        row.addComponents(newButtons);
                        return row;
                    })()]
                }).catch(_ => void 0);
                break;
            }
        }
    }
    async start() {
        try {
            const row = new ActionRowBuilder().addComponents([this.buttons.left(true), this.buttons.trash(), this.buttons.right()]);
            const message = await this.ctx.reply({embeds: [this.embeds[0]], components: [row]});
            const collector = message.createMessageComponentCollector({
                componentType: 2,
                time: this.collector.timeout,
                filter: this.collector.filter
            });

            collector.on("collect", b => {
                this.controlHandler(b, message);
                collector.resetTimer({ time: this.collector.timeout, idle: this.collector.timeout / 2 });
            });
            collector.on("end", _ => message.edit({components: [new ActionRowBuilder().setComponents(this.buttons.trash(true))]}).catch(_ => void 0));
            return collector;
        } catch (e) {
            console.log(e);
        }
    }

}
