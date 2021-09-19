const fs = require('fs');
const breeds = require('./../data/breeds.json');
const cats = require('./../data/cats.json');

const router = {
    '/': ()=>{
        const html =  fs.readFileSync('./views/home/index.html','utf8');
        const browserHead = {'Content-Type': 'text/html'};

       return {
        html,
        browserHead
       }
      
    },

    '/content/styles/site.css':()=>{
        const html = fs.readFileSync('./content/styles/site.css');
        const browserHead = {'Content-Type': 'text/css'};
        return {
            html,
            browserHead
           }
    },

    '/cats/add-cat':()=>{
        const html =  fs.readFileSync('./views/addCat.html','utf8', (err, result)=>{
         
            let catBreedHTML = breeds.map(breed=>`<option value="${breed.breed}">${breed.breed}</option>`);
            console.log(result);
            
            return result.replace('{{breeds}}',catBreedHTML);
            
        });
        const browserHead = {'Content-Type': 'text/html'};

       return {
        html,
        browserHead
       }
    },

    '/cats/add-breed':()=>{
        const html =  fs.readFileSync('./views/addBreed.html','utf8');
        const browserHead = {'Content-Type': 'text/html'};

       return {
        html,
        browserHead
       }
    },
    '/favicon.ico':()=>{
        const html =  fs.readFileSync('./content/images/pawprint.ico','utf8');
        const browserHead = {'Content-Type': 'text/html'};

       return {
        html,
        browserHead
       }
    }
}

module.exports = router;