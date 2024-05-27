import fs from "fs"
import path from 'path';

// https://www.spriters-resource.com/nintendo_switch/pokemonlegendsarceus/sheet/168442/
const inputDirectory = 'scripts/manual-sprites/legends-input';
const outputDir = 'scripts/manual-sprites/legends-output';

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

const regionMap = {
    '001': 'female',
    '011': 'alola',
    '031': 'galar',
    '041': 'hisui',
    '051': 'paldea',
}
async function getPokemonName(id){ 
    return await fetch(`https://pokecompanion.com/api/pokemon/${id}`).then(async (res) => {
        if (res.ok){
            const data = await res.json();
            return `${data.pokemon.name}`;
        }
        return 'unknown'
    })
}

const pokedexMap = {
    749: 712,
    751: 713,
    763: 704,
    764: 705,
    765: 706,
    841: 722,
    842: 723,
    843: 724,
    1001: 899,
    1002: 900,
    1003: 903,
    1004: 905,
    1005: 904,
    1006: 902,
    1007: 901
}

fs.readdir(inputDirectory, (err, files) => {
    files.forEach(async (file) => {
            const fileExtension = path.extname(file);
    
            if (fileExtension === '.png' && !file.includes('pre-v' ) && !file.includes('placeholder')){
                let baseFilename = file.replace("pokeicon_l_", "").replace('_n_00000000_fn_n', '').split('.png')[0];
                
                let [pokedex, variety, region] = baseFilename.split('_');

                pokedex = parseInt(pokedex);
                if (Object.keys(pokedexMap).includes(`${pokedex}`)){
                    pokedex = pokedexMap[pokedex];
                }
                
                if (region !== '000'){
                    if (![902, 903, 904, 905].includes(pokedex)){
                        const pokemonName = await getPokemonName(pokedex);
                        pokedex += '-' + pokemonName + '-' + regionMap[region]
                    }
                }

                if (pokedex == 201){
                    const alphabetMap = {
                        '011': 'a',
                        '012': 'b',
                        '013': 'c',
                        '014': 'd',
                        '015': 'e',
                        '016': 'f',
                        '017': 'g',
                        '018': 'h',
                        '019': 'i',
                        '020': 'j',
                        '021': 'k',
                        '022': 'l',
                        '023': 'm',
                        '024': 'n',
                        '025': 'o',
                        '026': 'p',
                        '027': 'q',
                        '028': 'r',
                        '029': 's',
                        '030': 't',
                        '031': 'u',
                        '032': 'v',
                        '033': 'w',
                        '034': 'x',
                        '035': 'y',
                        '036': 'z',
                        '037': 'exclamation',
                        '038': 'question',
                    };
                    const pokemonName = await getPokemonName(pokedex);
                    pokedex += '-' + pokemonName + '-' + alphabetMap[variety]
                } else if ([641, 642, 645].includes(pokedex)){
                    const pokemonName = pokedex === 641 ? 'tornadus' : pokedex === 642 ? 'tornadus' : 'landorus'
                    if (variety === '012'){
                        pokedex += '-' + pokemonName + '-therian';
                    } else if (variety === '011'){
                        pokedex += '-' + pokemonName + '-incarnate';
                    }
                }

                let newFilename = `${pokedex}${!['000', '001'].includes(variety) && ![201, 641, 642, 645].includes ? '-' + variety : ''}.png`

                fs.copyFile(path.join(inputDirectory, file), path.join(outputDir, newFilename), (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        // console.log(`${file} copied to ${newFilename}`);
                    }
                });
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