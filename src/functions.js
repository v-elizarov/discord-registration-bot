const { Client } = require('pg')
require('dotenv').config()

const config = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_LOCAL_PORT,
}
class BotFunctions {
    client;
    constructor() {
        this.client = new Client(config)
        this._connect()
    }

    _connect = () => {
        this.client.connect()
        console.log('connected')
    }

    _disconnect = () => {
        this.client.end()
        console.log('disconnect')
    }

    _generateNewPassword = () => {
        const numbers = '0123456789'
        const chars = 'abcdefghijklmnopqrstuvwxyz'
        let password = '';
        for (let i = 0; i < 6; i++) { 
            password += numbers[Math.floor(Math.random() * numbers.length)]
        }
        for (let j = 0; j < 2; j++) { 
            password += chars[Math.floor(Math.random() * chars.length)]
        }
        return password
    }

    isConnectedUserInDB = async (discordId) => {
        try {
            const response = await this.client.query('SELECT count(*) FROM public.user WHERE discord_id = $1', [discordId])
                .then(result => result.rows[0].count)
            return response > 0
        } catch (error) {
            console.log(`There was an error: ${error}`)
        }
    }

    registerNewUserInDB = async (discordId, discordTag) => {
        try {
            this.client.query('INSERT INTO public.user (discord_id, discord_tag, password) VALUES ($1, $2, $3)', [discordId, discordTag, this._generateNewPassword()]);
        } catch (error) {
            console.log(`There was an error: ${error}`)
        }
    }

    getLoginInfoForUser = async (discordId) => {
        try {
            const loginData = await this.client.query('SELECT discord_tag, password FROM public.user WHERE discord_id = $1', [discordId])
                .then(result => result.rows[0]);

            return `
            > Don't show the information below to other people
            > Use it to log in to the guild's web service
            > **Login:**    \`${loginData.discord_tag}\`
            > **Password:**    ||\`${loginData.password}\`||`
        } catch (error) {
            return `There was an error: ${error}`
        }
    }

    getBalanceForUser = async (discordId) => {
        try {
            const amount = await this.client.query('SELECT balance FROM public.user WHERE discord_id = $1', [discordId])
                .then(result => result.rows[0].balance);

            // converting number to the 0,000,000 format
            const balance = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

            return `> Total: **${balance}**`
        } catch (error) {
            return `There was an error: ${error}`
        }
    }
}

module.exports = BotFunctions;

