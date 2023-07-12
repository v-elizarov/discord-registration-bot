const { Client } = require('pg')
require('dotenv').config()

const connect = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_LOCAL_PORT,
}

const isConnectedUserInDB = (discordId) => {
    const client = new Client(connect)
    client.connect()
    const response = client.query('SELECT count(*) FROM public.user WHERE discord_id = $1', [discordId])
        .then(result => result.rows[0].count)
        .finally(() => client.end());
    return response > 0
}

const registerNewUserInDB = (discordId, discordTag) => {
    const client = new Client(connect)
    client.connect()
    const getPassword = generateNewPassword()
    client.query('INSERT INTO public.user (discord_id, discord_tag, password) VALUES ($1, $2, $3)', [discordId, discordTag, getPassword]);
}

const generateNewPassword = () => {
    const numbers = '0123456789'
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    let password = '';
    for (i = 0; i < 6; i++) { 
        password += numbers[Math.floor(Math.random() * numbers.length)]
    }
    for (j = 0; j < 2; j++) { 
        password += chars[Math.floor(Math.random() * chars.length)]
    }
    return password
}

module.exports = {
    isConnectedUserInDB,
    registerNewUserInDB
}

