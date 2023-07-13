const { REST, Routes } = require('discord.js')
require('dotenv').config()

const commands = [
    {
        name: 'login_info',
        description: 'Sends the private message with your login and password for web',
    },
    {
        name: 'my_balance',
        description: 'Sends the private message with your balance available for withdrawal',
    },
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)


try {
    console.log('Registering slash commands...');

    rest.put(
    Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
    ),
    { body: commands });

    console.log('Slash commands were registered successfully!');
} catch (error) {
    console.log(`There was an error: ${error}`);
}