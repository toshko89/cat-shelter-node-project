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
        let html = fs.readFileSync('./views/home/index.html', 'utf8');
        html = html.toString().replace('{{cats}}', homePage);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();

    } else if (pathName === '/cats/add-cat' && req.method === 'GET') {
        let catBreedHTML = breeds.map(breed => `<option value="${breed.breed}">${breed.breed}</option>`);
        let html = fs.readFileSync('./views/addCat.html', 'utf8')
        html = html.replace(' {{catBreeds}}', catBreedHTML);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();

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
        const html = fs.readFileSync('./views/addBreed.html', 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();

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

        let html = fs.readFileSync('./views/editCat.html', 'utf8');
        let [start,middle,catId] = pathName.split('/');
        let currentCat = cats.find(cat=>cat.id === catId);
        let modifiedData = html.toString().replace('{{id}}',catId);
        modifiedData = modifiedData.replace('{{name}}',currentCat.name);
        modifiedData = modifiedData.replace('{{description}}',currentCat.description);
        const breedsAsOptions = breeds.map((b)=>`<option value="${b.breed}">${b.breed}</option>`);
        modifiedData = modifiedData.replace('{{catBreeds}}',breedsAsOptions);
        modifiedData= modifiedData.replace('{{breed}}',currentCat.breed);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(modifiedData);
        res.end()

    } else if (pathName.includes('/cats-find-new-home') && req.method === 'GET') {

    } else if (pathName.includes('/cats-edit') && req.method === 'POST') {
        let [start,middle,catId] = pathName.split('/');
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            dataStorage.changeCat(fields,catId);
        });

        res.writeHead(302, {
            'Location': '/'
        });
       res.end();

    } else if (pathName.includes('/cats-find-new-home') && req.method === 'POST') {

    }else {
        return true;
    }

}
