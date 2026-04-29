const http = require('http');

function send(res, staus, data) {
    res.writeHead(staus, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data))
}

let tarefas = []
const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET' && url.startsWith('/tarefas')) {
        // 1. Criamos um objeto URL para conseguir ler os parâmetros (depois do ?)
        // O 'http://localhost' é apenas um preenchimento obrigatório para a classe URL
        const fullUrl = new URL(url, `http://${req.headers.host}`);
        const statusFiltro = fullUrl.searchParams.get('concluida');

        // 2. Se não houver filtro, manda a lista inteira
        if (statusFiltro === null) {
            return send(res, 200, tarefas);
        }

        // 3. Se houver filtro, transformamos o texto 'true' ou 'false' em booleano
        const filtrarConcluidas = statusFiltro === 'true';

        // 4. Filtramos a lista original sem alterá-la definitivamente
        const tarefasFiltradas = tarefas.filter(t => t.concluida === filtrarConcluidas);

        return send(res, 200, tarefasFiltradas);
    }

    if (method === 'POST' && url === '/tarefas') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const novaTarefa = JSON.parse(body);
                novaTarefa.id = Date.now();

                tarefas.push(novaTarefa);
                send(res, 200, novaTarefa);

            } catch (erro) {
                send(res, 404, { erro: 'JSON inválido' });
            }
        });
    }

    if (method === 'DELETE' && url.startsWith('/tarefas/')) {
        const id = parseInt(url.split('/')[2]);

        const tarefa = tarefas.find(t => t.id === id);

        if (!tarefa) return send(res, 404, { erro: 'livro não encontrado' });

        const novaLista = tarefas.filter(t => t.id !== id);
        tarefas = novaLista;
        send(res, 200, { mensagem: 'sucesso', dados: tarefas });
    }

    if (method === 'PUT' && url.startsWith('/tarefas/')) {
        const id = parseInt(url.split('/')[2]);
        const index = tarefas.findIndex(t => t.id === id);

        // Verificamos antes de tudo
        if (index === -1) {
            return send(res, 404, { erro: 'Tarefa não encontrada' });
        }

        let body = '';
        // Usamos o REQ (request) para pegar os dados
        req.on('data', chunk => { body += chunk.toString(); });

        req.on('end', () => {
            try {
                const dadosNovos = JSON.parse(body);

                // Atualizamos a tarefa na posição certa
                tarefas[index] = { ...tarefas[index], ...dadosNovos, id };

                // Retornamos a tarefa atualizada usando o nome certo da lista
                return send(res, 200, tarefas[index]);
            } catch (e) {
                send(res, 404, { erro: 'JSON inválido' });
            }
        });
    }

});

server.listen(3000, () => {
    console.log('Servidor rodando: http://localhost:3000/tarefas');
});