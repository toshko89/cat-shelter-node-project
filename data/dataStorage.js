const breeds = require('./breeds.json');
const cats = require('./cats.json');
const fs = require('fs');
const id = require('uniqid');

const newBreeds = (breed) => {
    breeds.push(breed);
    let result = JSON.stringify(breeds,'',2);
    fs.writeFileSync('./data/breeds.json', result);
}

const newCat = (cat,files)=>{
    // let filePath = files.upload.name;
    // fs.rename(filePath, './data/pictures')
    let newCat = {
        id: id(),
        name: cat.name,
        description:cat.description,
        breed:cat.breed,
    }

    cats.push(newCat)
    let result = JSON.stringify(cats,'',2);
    fs.writeFileSync('./data/cats.json',result);
}


const dataStorage = {
    newBreeds,
    newCat
}   

module.exports = dataStorage;