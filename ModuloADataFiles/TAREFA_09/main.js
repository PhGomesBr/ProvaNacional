const http = require('http');

const LIMIT = 3;       // máximo de requisições
const WINDOW = 60 * 1000; // janela de tempo em ms (1 minuto)
const requestsPerIp = {};
const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const now = Date.now();

  if (!requestsPerIp[ip]) {
    requestsPerIp[ip] = { count: 1, startTime: now };
  } else {
    const data = requestsPerIp[ip];
    const elapsed = now - data.startTime;
     
    if(elapsed > WINDOW){
        //reiniciar os baguio
        data.count = 1;
        data.startTime = now;
    }else{
        data.count ++;
    }

    if(data.count > LIMIT){
        const resetIn = WINDOW - elapsed;
        res.statusCode = 429;
        res.setHeader('Content-Type', 'application/josn');
        res.setHeader('X-RateLimit-Limit', LIMIT);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.ceil(resetIn/1000));

        return res.end(JSON.stringify({error: 'Too Many Requests. Try again later.'}));
        
    }
  }

  // Cabeçalhos de limite
  const falta = LIMIT - requestsPerIp[ip].count;
  const resetIn = WINDOW -( now - requestsPerIp[ip].startTime);

  res.setHeader('X-RateLimit-Limit', LIMIT);
  res.setHeader('X-RateLimit-Remaining', falta);
  res.setHeader('X-RateLimit-Reset', Math.ceil(resetIn / 1000)); // segundos até reset

  // Resposta normal da API
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Requisição aceita!' }));
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
