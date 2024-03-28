const { Client, GatewayIntentBits, ApplicationCommandOptionType } = require('discord.js');
const { REST } = require('discord.js');
const { Routes } = require('discord-api-types/v9');

require('dotenv').config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let allowedRoles = ['1222649094242304000', 'ROLE_ID_2',];

client.on('ready', async () => {
    try {
        console.log('Bot está online!');

        await rest.put(
            Routes.applicationGuildCommands(client.user.id, GUILD_ID),
            { body: commands },
        );

    } catch (error) {
        console.error('Erro ao registrar os comandos:', error);
    }

});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options, member, channel } = interaction;
    const deliveryChannelId = process.env.COMANDO_ID;
    const responseChannelId = process.env.ENTREGA_ID;

    if (channel.id !== deliveryChannelId)  {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

    if (commandName === 'entrega') {
        const hasPermission = member.roles.cache.some(role => allowedRoles.includes(role.id));
        if (!hasPermission) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }
        const user = options.getUser('usuario');
        const responseChannel = interaction.guild.channels.cache.get(responseChannelId);
        if (responseChannel) {
            await responseChannel.send(`${user}, sua skin foi enviada com sucesso! Verifique sua caixa de presente no jogo.`);
        } else {
            console.error('Canal de resposta não encontrado.');
        }
        await interaction.reply('Mensagem de entrega enviada com sucesso!');
    }
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options, member } = interaction;

  if (commandName === 'add-permissao') {
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
          const role = interaction.guild.roles.cache.get(roleId);
          return role ? role.name : 'Cargo desconhecido';
      });
      await interaction.reply(`Cargos permitidos: ${roleNames.join(', ')}`);
  }
});

const token = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID

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

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    if (typeof CLIENT_ID === 'string' && typeof GUILD_ID === 'string') {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

      console.log('Successfully reloaded application (/) commands.');
    } else {
      console.error('CLIENT_ID and GUILD_ID must be strings representing snowflake IDs.');
    }
  } catch (error) {
    console.error(error);
  }
})();

client.login(token);