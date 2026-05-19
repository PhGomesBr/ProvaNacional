const http = require('http');
const db = require('./databaseConection');
const crypto = require('crypto');

function send(res, code, data) {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function passwordHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const { method, url } = req;

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    if (method === 'POST' && url === '/login') {
        let body = '';

        req.on('data', (chunck) => body += chunck.toString());
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                if (!data.email || !data.password) return send(res, 401, { message: 'os campos nã podem estar vazios' });

                const [result] = await db.query('SELECT *FROM users WHERE email = ?', [data.email]);
                if (result.length === 0) return send(res, 404, { message: 'usuario n encontrado' });
                const user = result[0];

                const jaCriptografada = user.password.length === 64;
                const sqlToken = 'UPDATE users SET token = ?  WHERE id = ?';
                const token = crypto.randomBytes(32).toString('hex');
                const senhaHash = passwordHash(data.password);

                if (jaCriptografada) {
                    if (senhaHash === user.password) {
                        await db.query(sqlToken, [token, user.id]);
                        return send(res, 200, { message: 'login sucedito', token });
                    } else {
                        return send(res, 404, { message: 'algo deu errado tente novamente' });
                    }
                } else {
                    if (user.password === data.password) {
                        await db.query('UPDATE users SET password = ? WHERE id = ?', [senhaHash, user.id]);
                        await db.query(sqlToken, [token, user.id]);
                        return send(res, 200, { message: 'login sucedito', token });
                    } else {
                        return send(res, 404, { message: 'algo deu errado tente novamente' });
                    }
                }
            } catch (err) {
                return send(res, 500, { message: 'INternal eror' })
            }
        })
    }
});

server.listen(3000, ()=> console.log('http://localhos:3000'))

