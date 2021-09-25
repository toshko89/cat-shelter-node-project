const breeds = require('./breeds.json');
const catsDB = require('./cats.json');
const fs = require('fs');
const id = require('uniqid');


const changeCat = (cat, files, catId) => {

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
            let index = catsDB.findIndex(x=>x.id ===catId );
            currentCatInDB.name = cat.name;
            currentCatInDB.description = cat.description;
            currentCatInDB.breed = cat.breed;
            if(fileName !== undefined){
                currentCatInDB.image = fileName;
            }
            catsDB.splice(index,1,currentCatInDB);
            let result = JSON.stringify(catsDB, '', 2);
            fs.writeFile('./data/cats.json', result, (err) => {
                if (err) { console.log(err) }
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

const newCat = (cat, files) => {

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
        fs.writeFile('./data/cats.json', result, (err) => {
            if (err) { console.log(err) }
        });

    } else {
        return;
    }
}

const dataStorage = {
    newBreeds,
    newCat,
    changeCat
}

module.exports = dataStorage;