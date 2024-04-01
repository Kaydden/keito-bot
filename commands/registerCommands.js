const { REST } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const registerCommands = async (client) => {
    const commands = [
        {
            name: 'ping',
            description: 'Replies with Pong!'
        },
        {
            name: 'entrega',
            description: 'Envia uma skin para um usuário.',
            options: [
                {
                    type: 6,
                    name: 'usuario',
                    description: 'O usuário para o qual enviar a skin.',
                    required: true
                }
            ]
        },
        {
            name: 'add-permissao',
            description: 'Adiciona um cargo às permissões.',
            options: [
                {
                    type: 8,
                    name: 'role',
                    description: 'Nome do cargo',
                    required: true
                }
            ]
        },
        {
            name: 'remove-permissao',
            description: 'Remove um cargo das permissões.',
            options: [
                {
                    type: 8,
                    name: 'role',
                    description: 'Nome do cargo',
                    required: true
                }
            ]
        },
        {
            name: 'ver-permissoes',
            description: 'Mostra a lista de cargos permitidos.'
        }
    ];

    const token = process.env.TOKEN;
    const GUILD_ID = process.env.GUILD_ID;
    const CLIENT_ID = process.env.CLIENT_ID;
    const rest = new REST({ version: '9' }).setToken(token);

    try {
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );
        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar os comandos:', error);
    }
};

module.exports = { registerCommands };
