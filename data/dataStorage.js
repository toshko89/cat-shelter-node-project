const breeds = require('./breeds.json');
const cats = require('./cats.json');
const fs = require('fs');

const newBreeds = (breed) => {
    breeds.push(breed);
    let result = JSON.stringify(breeds,'',2);
    fs.writeFileSync('./data/breeds.json', result);
}

const newCat = (cat)=>{
    cats.push(cat);
    let result = JSON.stringify(breeds,'',2);
    fs.writeFileSync('./data/cats.json', result);
}


const dataStorage = {
    newBreeds,
    newCat
}   

module.exports = dataStorage;