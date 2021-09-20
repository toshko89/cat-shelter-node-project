const http = require('http');
const url = require('url');
const path = require('path');
const router = require('./router/router.js');
const qs = require('querystring');
const formidable = require('formidable');
const dataStorage = require('./data/dataStorage.js');
const breeds = require('./data/breeds.json');


http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;
    const method = req.method;

    if (pathName === '/cats/add-breed' && method === 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            dataStorage.newBreeds(fields);
        });
        res.setHeader('location','/');
        
    } else if (pathName === '/cats/add-cat' && method === 'POST') {
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {

            dataStorage.newCat(fields,files);   
        });
        res.setHeader('location','/');
        
    }

    const pageData = router[pathName]();
    res.writeHead(200, pageData.browserHead);
    res.write(pageData.html);
    res.end();

}).listen(3000);


console.log('App is listening on port 3000...');