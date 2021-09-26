const url = require('url')
const fs = require('fs');
const path = require('path');
const cats = require('../data/cats.json');
const formidable = require('formidable');
const htmlRender = require('../handlers/homeHTML.js');

module.exports = (req, res) => {
    const pathName = url.parse(req.url).pathname;

    if (pathName === '/' && req.method === 'GET') {

        let modifiedHomePage = htmlRender(cats);
        // let modifiedHomePage = cats.map(cat => `<li>
        // <img src="${path.join('./content/images' + `/${cat.image}`)}" alt="${cat.name}">
        // <h3>${cat.name}</h3>
        // <p><span>Breed: </span>${cat.breed}</p>
        // <p><span>Description: </span>${cat.description}</p>
        // <ul class="buttons">
        // <li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
        // <li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
        // </ul>
        // </li>`);

        fs.readFile('./views/home/index.html', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            data = data.toString().replace('{{cats}}', modifiedHomePage)
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });

    } else {
        return true;
    }
}
