const http = require('http');

function send(res, statuscode, data) {
    res.writeHead(statuscode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'POST' && url === '/convert') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                if (!body) return send(res, 400, { erro: 'corpo vazio' });

                // 1. SEPARAR LINHAS E LIMPAR O LIXO DO INSOMNIA
                const todasAsLinhas = body.split(/\r?\n/);

                const linhasLimpas = todasAsLinhas.filter(linha => {
                    const l = linha.trim();
                    // Ignora se for boundary (começa com --)
                    if (l.startsWith('--')) return false;
                    // Ignora se for metadado do formulário
                    if (l.toLowerCase().includes('content-disposition:')) return false;
                    if (l.toLowerCase().includes('content-type:')) return false;
                    // Ignora se estiver vazia
                    return l !== '';
                });

                if (linhasLimpas.length < 2) {
                    return send(res, 400, { erro: 'CSV invalido ou sem dados' });
                }

                // 2. PROCESSAR O CSV REAL
                // Pegamos a primeira linha limpa como cabeçalho
                const cabecalhos = linhasLimpas[0].split(',').map(c => c.trim());

                // Mapeamos o resto como dados
                const resultadoJson = linhasLimpas.slice(1).map(linha => {
                    const valores = linha.split(',');
                    let obj = {};
                    cabecalhos.forEach((cabecalho, i) => {
                        // Atribui o valor removendo espaços ou quebras de linha residuais
                        obj[cabecalho] = valores[i] ? valores[i].trim() : "";
                    });
                    return obj;
                });

                return send(res, 200, resultadoJson);

            } catch (err) {
                return send(res, 500, { erro: 'Erro no processamento' });
            }
        });
    } else {
        return send(res, 404, { erro: 'Not Found' });
    }
});

server.listen(3000, () => console.log('Rodando na 3000...'));