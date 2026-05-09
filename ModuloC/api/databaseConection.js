//database essa pagina

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ShangaiExpedition',
    waitForConnections: true
});

pool.getConnection()
    .then(connection => {
        console.log('banco conectado com sucesso!! 🚀🚀😘');
        connection.release(); //libera a conecxão de volta ao pool.
    })
    .catch(err => {
        console.error('Erro ao conectar ao MySql: ', err.message);
    });

module.exports = pool;