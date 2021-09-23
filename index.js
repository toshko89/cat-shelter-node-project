const http = require('http');
const handlers = require('./handlers/handler.js')

http.createServer((req, res) => {

    for (let handler of handlers) {
        if(!handler(req, res)) {
            break;
        }
    }

}).listen(3000);

console.log('App is listening on port 3000...');