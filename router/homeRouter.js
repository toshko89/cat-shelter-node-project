const formidable = require('formidable');
const url = require('url')
const fs = require('fs');
const path = require('path');
const dataStorage = require('../data/dataStorage.js');
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');
const homePage = require('../handlers/templatesHTML.js');
const getContentType = require('./staticFilesChecker.js');


module.exports = (req, res) => {
    const pathName = url.parse(req.url).pathname;

    if (pathName === '/' && req.method === 'GET') {
        let html = fs.readFileSync('./views/home/index.html');
        html = html.toString().replace('{{cats}}', homePage)
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();


        // html = html.toString().replace('{{cats}}', homePage);
        // res.writeHead(200, { 'Content-Type': 'text/html' });
        // res.write(html);
        // res.end();

    } else if (pathName === '/cats/add-cat' && req.method === 'GET') {
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
        // html = html.replace(' {{catBreeds}}', catBreedHTML);
        // res.writeHead(200, { 'Content-Type': 'text/html' });
        // res.write(html);
        // res.end();

    } else if (pathName === '/cats/add-cat' && req.method === 'POST') {
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            dataStorage.newCat(fields, files);
        });

        res.writeHead(302, {
            'Location': '/'
        });

        res.end();

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
        // res.writeHead(200, { 'Content-Type': 'text/html' });
        // res.write(html);
        // res.end();

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
        // let [start, middle, catId] = pathName.split('/');
        // let currentCat = cats.find(cat => cat.id === catId);
        // let modifiedData = data.toString().replace('{{id}}', catId);
        // modifiedData = modifiedData.replace('{{name}}', currentCat.name);
        // modifiedData = modifiedData.replace('{{description}}', currentCat.description);
        // const breedsAsOptions = breeds.map((b) => `<option value="${b.breed}">${b.breed}</option>`);
        // modifiedData = modifiedData.replace('{{catBreeds}}', breedsAsOptions);
        // modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);
        // res.writeHead(200, { 'Content-Type': 'text/html' });
        // res.write(modifiedData);
        // res.end()

    } else if (pathName.includes('/cats-find-new-home') && req.method === 'GET') {

    } else if (pathName.includes('/cats-edit') && req.method === 'POST') {
        let [start, middle, catId] = pathName.split('/');
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            console.log(fields);
            dataStorage.changeCat(fields, files, catId, res);
            // res.writeHead(302, {
            //     'Location': '/'
            // });
            // res.end();
        });



    } else if (pathName.includes('/cats-find-new-home') && req.method === 'POST') {

    } else {
        return true;
    }

}
