const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommands } = require('./commands/registerCommands');
const { handleEntregaCommand, handlePermissionCommands } = require('./commands/interactionHandler');

require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    try {
        console.log('Bot está online!');
        
        await registerCommands(client);
    } catch (error) {
        console.error('Erro ao registrar os comandos:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'entrega') {
        handleEntregaCommand(interaction);
    } else if (['add-permissao', 'remove-permissao', 'ver-permissoes'].includes(commandName)) {
        handlePermissionCommands(interaction);
    }
});

const token = process.env.TOKEN;
client.login(token);