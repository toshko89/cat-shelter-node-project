const formidable = require('formidable');
const url = require('url')
const fs = require('fs');
const path = require('path');
const dataStorage = require('../data/dataStorage.js');
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');
const htmlRender = require('../handlers/homeHTML.js')


module.exports = (req, res) => {
    const pathName = url.parse(req.url).pathname;

    if (pathName === '/cats/add-cat' && req.method === 'GET') {
        let catBreedHTML = breeds.map(breed => `<option value="${breed.breed}">${breed.breed}</option>`);
        fs.readFile('./views/addCat.html', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            data = data.replace(' {{catBreeds}}', catBreedHTML);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();

        })

    } else if (pathName === '/cats/add-cat' && req.method === 'POST') {
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            dataStorage.newCat(res, fields, files);
        });

    } else if (pathName === '/cats/add-breed' && req.method === 'GET') {
        fs.readFile('./views/addBreed.html', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });

    } else if (pathName === '/cats/add-breed' && req.method === 'POST') {
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            dataStorage.newBreeds(fields);
        });

        res.writeHead(302, {
            'Location': '/'
        });
        res.end();

    } else if (pathName.includes('/cats-edit') && req.method === 'GET') {

        fs.readFile('./views/editCat.html', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            let [start, middle, catId] = pathName.split('/');
            let currentCat = cats.find(cat => cat.id === catId);
            let modifiedData = data.toString().replace('{{id}}', catId);
            modifiedData = modifiedData.replace('{{name}}', currentCat.name);
            modifiedData = modifiedData.replace('{{description}}', currentCat.description);
            const breedsAsOptions = breeds.map((b) => `<option value="${b.breed}">${b.breed}</option>`);
            modifiedData = modifiedData.replace('{{catBreeds}}', breedsAsOptions);
            modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(modifiedData);
            res.end()
        });

    } else if (pathName.includes('/cats-find-new-home') && req.method === 'GET') {
        fs.readFile('./views/catShelter.html', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            let [start, middle, catId] = pathName.split('/');
            let currentCat = cats.find(cat => cat.id === catId);
            let catImg = `/content/images/${currentCat.image}`
            let modifiedData = data.toString().replace('{{id}}', catId);
            modifiedData = modifiedData.replace('{{name}}', currentCat.name);
            modifiedData = modifiedData.replace('{{description}}', currentCat.description);
            modifiedData = modifiedData.replace('{{catBreeds}}', currentCat.breed);
            modifiedData = modifiedData.replace('{{image}}', catImg);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(modifiedData);
            res.end()
        })

    } else if (pathName.includes('/cats-edit') && req.method === 'POST') {
        let [start, middle, catId] = pathName.split('/');
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            dataStorage.changeCat(res, fields, files, catId);
        });

    } else if (pathName.includes('/cats-find-new-home') && req.method === 'POST') {
        let [start, middle, catId] = pathName.split('/');
        dataStorage.deleteCat(res, catId);

    } else if (pathName === '/search' && req.method === 'POST') {
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            let searchName = fields.search;
            let searchedCat = cats.filter(c => c.name === searchName);
            if (searchedCat.length < 1) {
                fs.readFile('./views/404.html','utf8',(err,data)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    res.writeHead(404, {
                        'Content-Type': 'text/html'
                    });
                    res.write(data);
                    res.end();
                })
                return;
            }
            let modifiedHomePage = htmlRender(searchedCat);
            // let modifiedHomePage = searchedCat.map(cat => `<li>
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
        });
    } else {
        return true;
    }

}
