const { Client, IntentsBitField } = require('discord.js')
const functions = require('./functions.js')
require('dotenv').config()

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
    ],
})

client.on('ready', (member) => {
    console.log(`${member.user.tag} is online.`)
})

client.on("guildMemberAdd", (guild) => {
    // Registration works only for real people (not for bots)
    if (guild.user.bot === true) { return }

    const discordId = guild.user.id
    if (!functions.isConnectedUserInDB(discordId)) {
        // user hasn't registered yet
        const discordTag = guild.user.tag
        functions.registerNewUserInDB(discordId, discordTag)
    }
})

client.login(process.env.TOKEN)