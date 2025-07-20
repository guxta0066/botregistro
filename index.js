// GCM Registro Bot para REPLIT
// Usa variáveis de ambiente (.env) do próprio Replit

const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember]
});

// 🔧 Variáveis de ambiente (coloque no Secrets do Replit)
const TOKEN = process.env.TOKEN;
const CANAL_ID = process.env.CANAL_ID;
const CARGO_ID = process.env.CARGO_ID;
const express = require('express');

client.once('ready', async () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);

  const canal = await client.channels.fetch(CANAL_ID);
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('registro_gcm')
      .setLabel('📋 Fazer Registro')
      .setStyle(ButtonStyle.Primary)
  );

  await canal.send({
    content: '**📝 Clique no botão abaixo para fazer seu registro na GCM TÁTICA.**',
    components: [row]
  });
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton() && interaction.customId === 'registro_gcm') {
    const modal = new ModalBuilder()
      .setCustomId('formulario_gcm')
      .setTitle('Registro GCM')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('nome')
            .setLabel('Nome que deseja usar')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('id')
            .setLabel('ID do jogador')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );
    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === 'formulario_gcm') {
  const nome = interaction.fields.getTextInputValue('nome');
  const id = interaction.fields.getTextInputValue('id');

  const nick = `「 GCM 」${nome}「${id}」`;

  try {
    const CIVIL_ID = '1393991738665996469';
    const APROVADO_REC_ID = '1394058344184152084';

    await interaction.member.roles.remove([CIVIL_ID, APROVADO_REC_ID]);
    await interaction.member.roles.add(CARGO_ID);

    // Aqui está a linha que faltava
    await interaction.member.setNickname(nick);

    await interaction.reply({ content: `✅ Registro concluído!\nApelido alterado para **${nick}** e cargo atribuído.`, ephemeral: true });
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: '❌ Erro ao definir nickname ou cargo. Verifique permissões do bot.', ephemeral: true });
  }
}

});

client.login(TOKEN);

// Servidor web para manter o bot online com UptimeRobot
const app = express();

app.get('/', (req, res) => {
  res.send('🤖 Bot de Registro GCM TÁTICA está online!');
});

app.listen(3000, () => {
  console.log('🌐 Servidor web iniciado para UptimeRobot');
});
