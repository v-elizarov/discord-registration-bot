const { Client, IntentsBitField } = require('discord.js')
const botFunc = require('./functions.js')
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

const db = new botFunc()

client.on("guildMemberAdd", async (guild) => {
    // Registration works only for real people (not for bots)
    if (guild.user.bot === true) return;

    const discordId = guild.user.id
    const isUserInDB = await db.isConnectedUserInDB(discordId);
    if (!isUserInDB) {
        // user hasn't registered yet
        const discordTag = guild.user.tag
        await db.registerNewUserInDB(discordId, discordTag)
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'login_info') {
        const message = await db.getLoginInfoForUser(interaction.member.user.id)
        return interaction.reply({
            content: message,
            ephemeral: true
        });
    }
  
    if (interaction.commandName === 'my_balance') {
        const message = await db.getBalanceForUser(interaction.member.user.id)
        return interaction.reply({
            content: message,
            ephemeral: true
        });
    }
  });

client.login(process.env.TOKEN)

