const http = require('http');
const db = require('./databaseConnection');
const fs = require('fs')
const crypto = require('crypto');

function send(res, code, data) {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}
function passwordHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const { method, url } = req;

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // GET HOME
    if (method === 'GET' && url === '/home') {
        try {
            const sql = `
                    SELECT e.*, t.name AS type_name
                    FROM events e
                    INNER JOIN eventtypes t ON e.type_id = t.id ORDER BY e.Id
                    `;
            const [resultado] = await db.query(sql);

            const sql2 = 'SELECT * FROM tourismspots'
            const [resultado2] = await db.query(sql2)
            return send(res, 200, { events: resultado, tourismSpots: resultado2 });
        } catch (erro) {
            console.log(erro);
            return send(res, 500, {
                message: 'Internal error',
                erro: erro.message
            });
        }
    }//fim GET HOME

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
    }// fim POST LOGIN
    if (method === 'GET' && url === '/admin/events') {
        const [types] = await db.query('SELECT * FROM eventtypes');
        const [districts] = await db.query('SELECT * FROM districts');
        return send(res, 200, {
            types, districts
        });
    }
    if (method === 'POST' && url === '/admin/events/new') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                // Salva o evento
                const sql = `
                INSERT INTO Events 
                (name, description, date, start_time, end_time, type_id, latitude, longitude, district_id, access_link, people_quantity, created_by, updated_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
            `;

                const [result] = await db.query(sql, [
                    data.nome,
                    data.descricao,
                    data.data,
                    data.hora_inicio,
                    data.hora_termino,
                    data.tipo_evento,
                    data.latitude,
                    data.longitude,
                    data.distrito,
                    data.link_visualizacao,
                    data.capacidade
                ]);
                const eventId = result.insertId;

                if (data.imagem) {
                    const base64Data = data.imagem.replace(/^data:image\/\w+;base64,/, '');
                    const ext = data.imagem.split(';')[0].split('/')[1];
                    const imagemPath = `eventsImages/${Date.now()}.${ext}`;

                    fs.writeFileSync(imagemPath, Buffer.from(base64Data, 'base64'));

                    await db.query(
                        'INSERT INTO eventsImages (path, events_id) VALUES (?, ?)',
                        [imagemPath, eventId]
                    );
                }

                return send(res, 201, { message: 'Evento cadastrado!', id: eventId });

            } catch (err) {
                console.log(err);
                return send(res, 500, { message: 'Erro interno', erro: err.message });
            }
        });
    }

    if (method === 'PUT' && url.startsWith('/admin/events/')) {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const id = url.split('/')[3];
                const data = JSON.parse(body);
                const sql = `
                UPDATE events 
                SET
                    name = ?,
                    description = ?,
                    date = ?,
                    start_time = ?,
                    end_time = ?,
                    type_id = ?,
                    latitude = ?,
                    longitude = ?,
                    district_id = ?,
                    access_link = ?,
                    people_quantity = ?
                WHERE id = ?
            `;
                await db.query(sql, [
                    data.nome,
                    data.descricao,
                    data.data,
                    data.hora_inicio,
                    data.hora_termino,
                    data.tipo_evento,
                    data.latitude,
                    data.longitude,
                    data.distrito,
                    data.link_visualizacao,
                    data.capacidade,
                    id
                ]);
                return send(res, 200, {
                    message: 'Evento atualizado com sucesso'
                });

            } catch (err) {
                console.log(err);
                return send(res, 500, {
                    message: 'Erro interno',
                    erro: err.message
                });
            }
        });
    }
    if (method === 'DELETE' && url.startsWith('/admin/events/')) {
        try {
            const id = url.split('/')[3];
            await db.query('DELETE FROM events WHERE id = ?', [id]);
            return send(res, 200, {
                message: 'Evento deletado com sucesso'
            });

        } catch (err) {

            return send(res, 500, {
                message: 'Erro interno',
                erro: err.message
            });
        }
    }
});


server.listen(3000, () => console.log('http://localhost:3000'));