//server este file 
const http = require('http');
const db = require('./databaseConection');
const crypto = require('crypto');

function send(res, code, data) {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}
//função para criazr a criptografia 
function hashPassword(password) {
    return crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');
}


const server = http.createServer(async (req, res) => {

    //fazer cors para o front conseguir acessar
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // 4. Lidar com requisições "preflight" (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    const { method, url } = req;

    if (method === 'POST' && url === '/login') {
        let body = '';

        req.on('data', (chunk) => body += chunk.toString());
        req.on('end', async () => {
            try {

                const data = JSON.parse(body);
console.log("Dados recebidos no servidor:", data); // Adicione isso aqui!
                if (!data.password || !data.email) {
                    return send(res, 401, { mensagem: 'Os campos não podem ser vazios' });
                }

                //ponchetes para pegar so o primeiro valor. com desestruturação
                const [result] = await db.query('SELECT * FROM Users WHERE email = ?', [data.email]);

                if (result.length === 0) return send(res, 404, { mensagem: 'Usuário não encontrado' });

                const user = result[0];
                const senhaHash = hashPassword(data.password);
                const senhaJaCriptografada = user.password.length === 64;

                //se ela ja estiver
                if (senhaJaCriptografada) {
                    if (senhaHash === user.password) {
                        return send(res, 200, { mensagem: 'Login realizado com sucesso' });
                    } else {
                        return send(res, 401, { mensagem: 'Senha ou email inválidos' });
                    }
                } else {
                    //se ela ainda n tiver criptografada
                    if (data.password === user.password) {
                        await db.query('UPDATE Users SET password = ? WHERE id = ?', [senhaHash, user.id]);
                        return send(res, 200, { mensagem: 'Login realizado com sucesso' });
                    } else {
                        return send(res, 401, { mensagem: 'Senha ou email inválidos' });
                    }
                }

            } catch (error) {
                return send(res, 500, { mensagem: 'internal error' });
            }
        })
    } else {
        return send(res, 404, { mensagem: 'rota n encontrada' })
    }

})

server.listen(3000, () => { console.log('🚀 servidor rodando: http://localhost:3000') });