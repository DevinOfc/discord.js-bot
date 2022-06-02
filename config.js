module.exports = {
    developerId: process.env.DEVELOPER_ID || '561170896480501790',
    prefix: process.env.BOT_PREFIX || 'a',
    slashRegister: {
        clientId: process.env.CLIENT_ID || '',
        guildId: process.env.GUILD_ID || ''
    },
    token: process.env.BOT_TOKEN || ''
};
