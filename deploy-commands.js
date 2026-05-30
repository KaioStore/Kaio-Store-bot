require('dotenv').config();

const fs = require('fs');
const path = require('path');

const {
  REST,
  Routes
} = require('discord.js');

const config = require('./config.json');

const commands = [];

const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

  const command = require(path.join(commandsPath, file));

  commands.push(command.data.toJSON());
}

const rest = new REST({
  version: '10'
}).setToken(process.env.TOKEN);

(async () => {

  try {

    console.log('Registrando comandos...');

    await rest.put(
      Routes.applicationGuildCommands(
        config.clientId,
        config.guildId
      ),
      {
        body: commands
      }
    );

    console.log('✅ Comandos registrados.');

  } catch (error) {
    console.error(error);
  }

})();
