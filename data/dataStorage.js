const breeds = require('./breeds.json');
const cats = require('./cats.json');
const fs = require('fs');
const id = require('uniqid');



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
            fs.unlink(filePath, err => {sconsole.log(err)})
        })

        let newCat = {
            id: id(),
            name: cat.name,
            description: cat.description,
            breed: cat.breed,
            image:fileName
        }

        cats.push(newCat)
        let result = JSON.stringify(cats, '', 2);
        fs.writeFile('./data/cats.json', result, (err) => {
            if (err) {console.log(err)}
        });

    } else {
        return;
    }
}

const dataStorage = {
    newBreeds,
    newCat
}

module.exports = dataStorage;