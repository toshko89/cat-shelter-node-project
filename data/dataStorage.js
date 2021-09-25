const breeds = require('./breeds.json');
const catsDB = require('./cats.json');
const fs = require('fs');
const id = require('uniqid');

const deleteCat = (res, catId) => {
    fs.readFile('./data/cats.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        data = JSON.parse(data);
        let newDB = catsDB.filter(x => x.id !== catId);
        let result = JSON.stringify(newDB, '', 2);
        fs.writeFile('./data/cats.json', result, (err) => {
            if (err) { console.log(err) }

            res.writeHead(302, { 'Location': '/' });
            return res.end();
        });

    })
}

const changeCat = (res, cat, files, catId) => {
    if (cat.name !== '' && cat.description !== '' && cat.breed !== '') {
        fs.readFile('./data/cats.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            let fileName = files.upload.name;
            let filePath = files.upload.path
            let readStream = fs.createReadStream(filePath);
            let writeStream = fs.createWriteStream(`./content/images/${fileName}`);
            readStream.pipe(writeStream);
            readStream.on('end', () => {
                fs.unlink(filePath, err => { console.log(err) })
            });

            data = JSON.parse(data);
            let currentCatInDB = data.find(cat => cat.id === catId);
            let index = catsDB.findIndex(x => x.id === catId);
            currentCatInDB.name = cat.name;
            currentCatInDB.description = cat.description;
            currentCatInDB.breed = cat.breed;
            if (fileName !== '') {
                currentCatInDB.image = fileName;
            }
            catsDB.splice(index, 1, currentCatInDB);
            let result = JSON.stringify(catsDB, '', 2);
            fs.writeFile('./data/cats.json', result, (err) => {
                if (err) { console.log(err) }
                res.writeHead(302, { 'Location': '/' });
                return res.end();
            });
        })
    }
}

const newBreeds = (breed) => {
    breeds.push(breed);
    let result = JSON.stringify(breeds, '', 2);
    fs.writeFile('./data/breeds.json', result, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

const newCat = (res, cat, files) => {

    if (cat.name !== '' && cat.description !== ''
        && cat.breed !== '') {

        let fileName = files.upload.name;
        let filePath = files.upload.path
        let readStream = fs.createReadStream(filePath);
        let writeStream = fs.createWriteStream(`./content/images/${fileName}`);
        readStream.pipe(writeStream);
        readStream.on('end', () => {
            fs.unlink(filePath, err => { console.log(err) })
        })

        let newCat = {
            id: id(),
            name: cat.name,
            description: cat.description,
            breed: cat.breed,
            image: fileName
        }

        catsDB.push(newCat)
        let result = JSON.stringify(catsDB, '', 2);
        fs.writeFile('./data/cats.json', result, (err, data) => {
            if (err) { console.log(err) }

            res.writeHead(302, {
                'Location': '/'
            });
            return res.end();
        });

    } else {
        return;
    }
}

const dataStorage = {
    newBreeds,
    newCat,
    changeCat,
    deleteCat
}

module.exports = dataStorage;