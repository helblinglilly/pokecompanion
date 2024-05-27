import fs from "fs"
import path from 'path';

const inputDirectory = 'scripts/manual-sprites/sv-input';
const outputDir = 'scripts/manual-sprites/sv-output';

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
    11: 'alola',
    31: 'galar',
    41: 'hisui',
    51: 'paldea',
}

const pokedexMap = {
    702: 708,
    703: 709,
    704: 667,
    705: 668,
    706: 664,
    707: 665,
    708: 666,
    709: 690,
    710: 691,
    713: 669,
    714: 670,
    715: 671,
    716: 714,
    717: 653,
    718: 654,
    719: 659,
    720: 650,
    721: 651,
    722: 652,
    723: 656,
    724: 657,
    725: 658,
    726: 686,
    727: 687,
    728: 672,
    729: 673,
    733: 677,
    734: 678,
    741: 702,
    749: 712,
    751: 713,
    753: 661,
    754: 662,
    755: 663,
    756: 692,
    757: 693,
    760: 707,
    761: 701,
    762: 715,
    763: 704,
    764: 705,
    765: 706,
    766: 703,
    767: 700,
    772: 719,
    773: 721,
    774: 720,
    801: 747,
    802: 748,
    805: 757,
    806: 758,
    807: 731,
    808: 732,
    809: 733,
    810: 765,
    811: 775,
    812: 761,
    813: 762,
    814: 763,
    815: 766,
    816: 782,
    817: 783,
    818: 784,
    819: 778,
    822: 769,
    823: 770,
    824: 774,
    825: 741,
    826: 734,
    827: 735,
    828: 744,
    829: 745,
    834: 742,
    835: 743,
    836: 736,
    837: 737,
    838: 738,
    839: 749,
    840: 750,
    841: 722,
    842: 723,
    843: 724,
    844: 725,
    845: 726,
    846: 727,
    847: 728,
    848: 729,
    849: 730,
    850: 751,
    851: 752,
    855: 779,
    859: 739,
    860: 740,
    863: 764,
    865: 800,
    868: 753,
    869: 754,
    871: 789,
    872: 790,
    873: 791,
    874: 792,
    882: 801,
    903: 833,
    904: 834,
    917: 982,
    918: 917,
    919: 918,
    920: 919,
    921: 920,
    922: 953,
    923: 954,
    924: 971,
    925: 869,
    926: 878,
    927: 956,
    928: 981,
    929: 960,
    930: 961,
    931: 977,
    932: 976,
    933: 963,
    934: 838,
    935: 928,
    936: 929,
    937: 930,
    938: 951,
    939: 952,
    940: 938,
    941: 939,
    942: 965,
    943: 966,
    944: 968,
    945: 924,
    946: 873,
    947: 974,
    948: 975,
    949: 996,
    950: 997,
    951: 998,
    952: 817,
    953: 967,
    954: 921,
    955: 922,
    956: 923,
    957: 940,
    958: 941,
    959: 962,
    960: 931,
    961: 973,
    962: 950,
    963: 932,
    964: 933,
    965: 934,
    966: 969,
    967: 970,
    968: 944,
    969: 945,
    970: 926,
    971: 927,
    972: 942,
    973: 943,
    974: 946,
    975: 947,
    976: 885,
    977: 1000,
    978: 984,
    979: 986,
    980: 1009,
    981: 989,
    982: 985,
    983: 987,
    984: 988,
    985: 1005,
    986: 990,
    987: 1010,
    988: 994,
    989: 992,
    990: 993,
    991: 995,
    992: 991,
    993: 1006,
    994: 1003,
    995: 1002,
    996: 1001,
    997: 1004,
    998: 1007,
    999: 1008,
    1000: 957,
    1001: 958,
    1002: 959,
    1003: 935,
    1004: 936,
    1005: 937,
    1006: 948,
    1007: 949,
    1008: 983,
    1009: 980,
    1010: 979,
    1016: 1017,
    1017: 1011,
    1018: 1019,
    1019: 1014,
    1020: 1015,
    1021: 1016,
    1022: 1020,
    1023: 1021,
    1024: 1023,
    1025: 1022,
    1026: 1024,
    1027: 1025,
    1028: 1018,
    1029: 1012,
    1030: 1013,
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

fs.readdir(inputDirectory, (err, files) => {
    files.forEach(async (file, i) => {
            const fileExtension = path.extname(file);
    
            if (fileExtension === '.png' && !file.includes('pre-v' ) && !file.includes('placeholder')){
                let baseFilename = file.replace("pm", "").replace('_big', '').split('.png')[0];
    
                let [pokedex, variety, region, other] = baseFilename.split('_');

                pokedex = parseInt(pokedex);

                if (pokedex >= 1010){
                    pokedex = pokedex - 104;
                }
                
                if (Object.keys(pokedexMap).includes(`${pokedex}`)){
                    pokedex = pokedexMap[pokedex];
                }

                if (region !== '00'){
                    const pokemonName = await getPokemonName(pokedex);
                    pokedex += '-' + pokemonName + '-' + regionMap[region]
                }

                let newFilename = `${pokedex}${variety !== '00' ? '-' + variety : ''}.png`

                fs.copyFile(path.join(inputDirectory, file), path.join(outputDir, newFilename), (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        // console.log(`${file} copied to ${newFilename}`);
                    }
                });
            }

            if (fileExtension === '.gif'){
                const fileName = file.split('.')[0];
                let isShiny = fileName.includes('s');
                let pokedex = fileName.split('-')[0].replace('s', '');

                const newFilename = `${pokedex}${isShiny ? '-shiny' : ''}.gif`

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