import fs from "fs"
import path from 'path';

// https://projectpokemon.org/home/docs/spriteindex_148/3d-models-generation-8-pok%C3%A9mon-r123/

const inputDirectory = 'scripts/manual-sprites/sword-shield-input';
const outputDir = 'scripts/manual-sprites/sword-shield-output';

fs.readdir(outputDir, (err, files) => {
    if (err) {
        console.error(err);
    } else {
        files.forEach((file) => {
            fs.unlink(path.join(outputDir, file), (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });
    }
});

async function getPokemonName(id){ 
    return await fetch(`https://pokecompanion.com/api/pokemon/${id}`).then(async (res) => {
        if (res.ok){
            const data = await res.json();
            return `${data.pokemon.name}`;
        }
        return 'unknown'
    })
}

fs.readdir(inputDirectory, (err, files) => {
    files.forEach(async (file) => {
            const fileExtension = path.extname(file);
    
            if (fileExtension === '.gif'){
                let baseFilename = file.replace("gigantamax", "gmax").split('.gif')[0];
    
                const parts = baseFilename.split('-');
                let pokedex =parseInt(parts[0]);
                let others =  parts.slice(2);

                let filename = `${pokedex}`;

                const variants = others.filter((entry) => !['s', 'shiny', 'f', 'female'].includes(entry));

                if (variants.length > 0){
                    const pokemonName = await getPokemonName(pokedex);
                    filename += '-' + pokemonName + '-' + variants.join('-');
                }

                if (others.some((entry) => entry === 'f' || entry === 'female')){
                    filename += '-female'
                }
                if (others.some((entry) => entry === 's' || entry === 'shiny')){
                    filename += '-shiny'
                }

                let newFilename = `${filename}.gif`


                if (pokedex <= 890){
                    fs.copyFile(path.join(inputDirectory, file), path.join(outputDir, newFilename), (err) => {
                        if (err) {
                            console.error(err);
                        } else {
                            // console.log(`${file} copied to ${newFilename}`);
                        }
                    });
                }
            }
    });
});

const maxId = 1025;

let missing = [];

for (let i = 1; i <= maxId; i++){
    fs.readdir(outputDir, (err, files) => {
        const hasMatching = files.some((file) => {
            const pokedex = file.split('.')[0].split('-')[0];
            return Number(pokedex) === i;
        })

        if (!hasMatching){
            missing.push(i);
        }
    })
}

console.log('Missing Pokemon', missing);