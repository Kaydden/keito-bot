const handleEntregaCommand = async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options, member, channel } = interaction;
    const deliveryChannelId = process.env.COMANDO_ID;
    const responseChannelId = process.env.ENTREGA_ID;
    const allowedRoles = ['1102772131944747088', '1102772128098566174', '1170534085769302027', '1096423219793231995'];

    if (channel.id !== deliveryChannelId) {
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
            await interaction.reply('Mensagem de entrega enviada com sucesso!');
        } else {
            console.error('Canal de resposta não encontrado.');
            await interaction.reply({ content: 'Ocorreu um erro ao enviar a mensagem de entrega.', ephemeral: true });
        }
    }
};

const handlePermissionCommands = async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options, member } = interaction;
    const allowedRoles = ['1102772131944747088', '1102772128098566174', '1170534085769302027', '1096423219793231995'];

    if (!allowedRoles.some(roleId => member.roles.cache.has(roleId))) {
        return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
    }

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
        const index = allowedRoles.indexOf(role.id);
        if (index !== -1) {
            allowedRoles.splice(index, 1);
        }
        await interaction.reply(`Cargo removido das permissões: ${role.name}`);
    } else if (commandName === 'ver-permissoes') {
        const roleNames = allowedRoles.map(roleId => {
            const role = interaction.guild.roles.cache.get(roleId);
            return role ? role.name : 'Cargo desconhecido';
        });
        await interaction.reply(`Cargos permitidos: ${roleNames.join(', ')}`);
    }
};

module.exports = { handleEntregaCommand, handlePermissionCommands };
