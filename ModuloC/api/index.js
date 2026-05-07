const http = require('http');

const server  = http.createServer((req, res)=>{
    const {method, url} = req;

    if(method  ==='GET' &&url==='/'){
        return[];
    }
});

server.listen(3000, ()=> console.log('http://localhost:3000'));