const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    database: 'ShangaiExpedition',
    user: 'root',
    password: '',
    waitForConnections: true
});


pool.getConnection()
    .then(connection => {
        console.log('banco rodando');
        connection.release() //pra voltar ao pool
    })
    .catch(err => {
        console.log('erro ao conectar ao banco de dados' + err.message);
    });

module.exports = pool;