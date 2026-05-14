// server este file
const http = require('http');
const db = require('./databaseConection');
const crypto = require('crypto');

function send(res, stat, data) {
    res.writeHead(stat, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex')
}

async function checkAuth(req, res) {
    const token = req.headers['authorization'];

    if (!token) {
        send(res, 401, { message: 'não autorizado' });
        return false;
    }
    const [result] = await db.query('SELECT * FROM users WHERE token = ?', [token]);

    if (result.length === 0) {
        send(res, 401, { message: 'não autorizado' });
        return false;
    }

    return result[0];
}
const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const { method, url } = req;
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (method === 'POST' && url === '/login') {
        //        const user = await checkAuth(req, res);
        let body = '';

        req.on('data', (chunk) => body += chunk.toString());
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                if (!data.email || !data.password) return send(res, 401, { message: 'os campos não podem estar vazios' });

                const [result] = await db.query('SELECT * FROM users WHERE email = ?', [data.email]);

                if (result.length === 0) return send(res, 404, { message: 'usuario não encontrado' });
                const user = result[0];

                const senhajaHash = user.password.length === 64;
                const senhaHash = hashPassword(data.password);

                const sqlToken = 'UPDATE users SET token = ?  WHERE id = ?'
                const token = crypto.randomBytes(32).toString('hex');
                if (senhajaHash) {
                    if (data.email === user.email && senhaHash === user.password) {
                        await db.query(sqlToken, [token, user.id]);
                        console.log('logado');
                        return send(res, 200, { message: 'login realizadop com sucesso!!', token });
                    } else {
                        return send(res, 400, { message: 'senha ou email invalidos' })
                    }
                } else {
                    if (data.email === user.email && data.password === user.password) {
                        await db.query('UPDATE users SET password = ? WHERE   id = ?', [senhaHash, user.id]);
                        await db.query(sqlToken, [token, user.id]);
                        console.log('logado');

                        return send(res, 200, { message: 'login realizadop com sucesso!!', token });
                    } else {
                        return send(res, 400, { message: 'senha ou email invalidos' })
                    }
                }
            } catch (err) {
                return send(res, 500, { message: 'internal error' });
            }
        })
    } else {
        return send(res, 404, { message: 'pagina n encontrada' });
    }
});

server.listen(3000, () => {
    console.log('http://localhost:3000')
})

