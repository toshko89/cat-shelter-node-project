const url = require('url')
const fs = require('fs');
const cats = require('../data/cats.json');
const htmlRender = require('../handlers/homeHTML.js');

module.exports = (req, res) => {
    const pathName = url.parse(req.url).pathname;

    if (pathName === '/' && req.method === 'GET') {
        fs.readFile('./views/home/index.html', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            let modifiedHomePage = htmlRender(cats);
            data = data.toString().replace('{{cats}}', modifiedHomePage)
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });

    } else {
        return true;
    }
}
