const {SlashCommandBuilder,EmbedBuilder} = require('discord.js');

const db = require('../database/sqlite');const config = require('../config.json');

module.exports = {

data: new SlashCommandBuilder().setName('avaliar').setDescription('Enviar avaliação').addStringOption(option =>option.setName('texto').setDescription('Digite a avaliação').setRequired(true)),

async execute(interaction, client) {

const texto =
  interaction.options.getString('texto');

db.get(
  'SELECT COUNT(*) as total FROM avaliacoes',
  async (err, row) => {

    if (err) {
      console.error(err);

      return interaction.reply({
        content: 'Erro ao acessar o banco.',
        ephemeral: true
      });
    }

    const total = row.total + 1;
    const pedido = total;

    db.run(
      'INSERT INTO avaliacoes (texto, pedido) VALUES (?, ?)',
      [texto, pedido]
    );

    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('Avaliação Recebida! 🖤')
      .setDescription(

`• Avaliação: ${texto}

• Total de avaliações: ${total}

• Pedido: ${pedido}

Esta avaliação foi registrada de forma anônima.`);

    const canal =
      client.channels.cache.get(
        config.avaliacoesChannel
      );

    if (canal) {
      await canal.send({
        embeds: [embed]
      });
    }

    await interaction.reply({
      content: 'Avaliação enviada com sucesso.',
      ephemeral: true
    });

  }
);

}

};
