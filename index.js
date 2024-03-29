const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('discord.js');
const { Routes } = require('discord-api-types/v9');

require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let allowedRoles = ['1102772131944747088', '1102772128098566174', '1170534085769302027', '1096423219793231995'];

const token = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const deliveryChannelId = process.env.COMANDO_ID;
const responseChannelId = process.env.ENTREGA_ID;

const rest = new REST({ version: '9' }).setToken(token);

client.once('ready', async () => {
    try {
        console.log('Bot está online!');
        
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );
    } catch (error) {
        console.error('Erro ao registrar os comandos:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options, member, channel, guild } = interaction;

    if (channel.id !== deliveryChannelId) {
        return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
    }

    if (commandName === 'entrega') {
        const hasPermission = member.roles.cache.some(role => allowedRoles.includes(role.id));
        if (!hasPermission) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }
        const user = options.getUser('usuario');
        const responseChannel = guild.channels.cache.get(responseChannelId);
        if (responseChannel) {
            await interaction.deferReply();
            await responseChannel.send(`${user}, sua skin foi enviada com sucesso! Verifique sua caixa de presente no jogo.`);
            await interaction.followUp('Mensagem de entrega enviada com sucesso!');
        } else {
            console.error('Canal de resposta não encontrado.');
        }
    } else if (commandName === 'add-permissao') {
        const role = options.getRole('role');
        if (!role) {
            return interaction.reply('Por favor, mencione um cargo válido.');
        }
        allowedRoles.push(role.id);
        await interaction.reply(`Cargo adicionado às permissões: ${role.name}`);
    } else if (commandName === 'remove-permissao') {
        const role = options.getRole('role');
        if (!role) {
            return interaction.reply('Por favor, mencione um cargo válido.');
        }
        allowedRoles = allowedRoles.filter(id => id !== role.id);
        await interaction.reply(`Cargo removido das permissões: ${role.name}`);
    } else if (commandName === 'ver-permissoes') {
        const roleNames = allowedRoles.map(roleId => {
            const role = guild.roles.cache.get(roleId);
            return role ? role.name : 'Cargo desconhecido';
        });
        await interaction.reply(`Cargos permitidos: ${roleNames.join(', ')}`);
    }
});

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
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
        ],
    },
    {
        name: 'add-permissao',
        description: 'Adiciona um cargo às permissões.',
        options: [
            {
                type: 8,
                name: 'role',
                description: 'nome do cargo',
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
                description: 'nome do cargo',
                required: true
            }
        ]
    },
    {
        name: 'ver-permissoes',
        description: 'Mostra a lista de cargos permitidos.'
    }
];

client.login(token);
