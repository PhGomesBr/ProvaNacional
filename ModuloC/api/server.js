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
                if (!data.password || !data.email) {
                    return send(res, 401, { mensagem: 'Os campos não podem ser vazios' });
                }

                //ponchetes para pegar so o primeiro valor. com desestruturação
                const [result] = await db.query('SELECT * FROM Users WHERE email = ?', [data.email]);

                if (result.length === 0) return send(res, 404, { mensagem: 'Usuário não encontrado' });

                const user = result[0];
                const senhaHash = hashPassword(data.password);
                const senhaJaCriptografada = user.password.length === 64;
                //para colocar o token
                const sqlToken = 'UPDATE Users SET token = ? WHERE id = ?';
                
                //se ela ja estiver
                if (senhaJaCriptografada) {
                    const token = crypto.randomBytes(32).toString('hex');
                    if (senhaHash === user.password) {
                        //atualiza o tokem do usuario
                        await db.query(sqlToken, [token, user.id]);
                        return send(res, 200, { mensagem: 'Login realizado com sucesso' });
                    } else {
                        return send(res, 401, { mensagem: 'Senha ou email inválidos' });
                    }
                } else {
                    const token = crypto.randomBytes(32).toString('hex');
                    //se ela ainda n tiver criptografada
                    if (data.password === user.password) {
                        await db.query('UPDATE Users SET password = ? WHERE id = ?', [senhaHash, user.id]);
                        //atualiza o tokem do usuario
                        await db.query(sqlToken, [token, user.id]);
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
        return send(res, 404, { mensagem: 'rota não encontrada' })
    }

})

server.listen(3000, () => { console.log('🚀 servidor rodando: http://localhost:3000') });