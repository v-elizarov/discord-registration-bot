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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'login_info') {
        const message = await functions.getLoginInfoForUser(interaction.member.user.id)
        return interaction.reply({
            content: message,
            ephemeral: true
        });
    }
  
    if (interaction.commandName === 'my_balance') {
        const message = await functions.getUserBalance(interaction.member.user.id)
        return interaction.reply({
            content: message,
            ephemeral: true
        });
    }
  });

client.login(process.env.TOKEN)