require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Collection
} = require('discord.js');

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
  res.send('Bot Online');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Web Server iniciado na porta ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');

if (!fs.existsSync(commandsPath)) {
  fs.mkdirSync(commandsPath);
}

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

  const command = require(path.join(commandsPath, file));

  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`✅ ${client.user.tag} online.`);
});

client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {

    await command.execute(interaction, client);

  } catch (error) {

    console.error(error);

    if (interaction.replied || interaction.deferred) {

      await interaction.followUp({
        content: 'Erro ao executar comando.',
        ephemeral: true
      });

    } else {

      await interaction.reply({
        content: 'Erro ao executar comando.',
        ephemeral: true
      });

    }
  }
});

client.login(process.env.TOKEN);
