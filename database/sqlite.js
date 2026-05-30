const sqlite3 = require(‘sqlite3’).verbose();
const path = require(‘path’);

const db = new sqlite3.Database(
path.join(__dirname, ‘../data/bot.db’)
);

db.serialize(() => {

db.run(CREATE TABLE IF NOT EXISTS avaliacoes ( id INTEGER PRIMARY KEY AUTOINCREMENT, texto TEXT NOT NULL, pedido INTEGER NOT NULL, criado_em DATETIME DEFAULT CURRENT_TIMESTAMP ));

});

module.exports = db;
