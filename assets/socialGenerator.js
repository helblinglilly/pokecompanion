import fs from 'fs';
import fetch from 'node-fetch';
import PokemonNames from '../src/lib/data/pokemonNames.json' assert { type: 'json' };
import pkg from 'convert-svg-to-png';
const { convertFile } = pkg;

const genericFile = fs.readFileSync('./assets/socialPreview.svg', 'utf-8');
const pokemonFile = fs.readFileSync('./assets/pokemonSocialPreview.svg', 'utf-8');

function getLastPokemonId() {
	let highest = 1;
	PokemonNames.forEach((a) => {
		if (highest < a.id && a.id < 10000) {
			highest = a.id;
		}
	});
	return highest;
}
const lastPokemonId = getLastPokemonId();

if (!fs.existsSync('./static/socialpreview')) {
	fs.mkdirSync('./static/socialpreview');
}
if (!fs.existsSync('./static/socialpreview/pokemon')) {
	fs.mkdirSync('./static/socialpreview/pokemon');
}

const generic = genericFile.replace(/Top Text/, 'Pokécompanion').replace(/Bottom Text/, '');
fs.writeFileSync(`./static/socialpreview/generic.svg`, generic, 'utf-8');

const home = genericFile.replace(/Top Text/, 'Pokécompanion').replace(/Bottom Text/, 'Homepage');
fs.writeFileSync(`./static/socialpreview/home.svg`, home, 'utf-8');

const about = genericFile.replace(/Top Text/, 'Pokécompanion').replace(/Bottom Text/, 'About');
fs.writeFileSync(`./static/socialpreview/about.svg`, about, 'utf-8');

const settings = genericFile
	.replace(/Top Text/, 'Pokécompanion')
	.replace(/Bottom Text/, 'Settings');
fs.writeFileSync(`./static/socialpreview/settings.svg`, settings, 'utf-8');

const results = genericFile
	.replace(/Top Text/, 'Pokécompanion')
	.replace(/Bottom Text/, 'Search Results');
fs.writeFileSync(`./static/socialpreview/results.svg`, results, 'utf-8');

const pokemonPage = genericFile
	.replace(/Top Text/, 'Pokécompanion')
	.replace(/Bottom Text/, 'Pokémon');
fs.writeFileSync(`./static/socialpreview/pokemonPage.svg`, pokemonPage, 'utf-8');

const movesPage = genericFile.replace(/Top Text/, 'Pokécompanion').replace(/Bottom Text/, 'Moves');
fs.writeFileSync(`./static/socialpreview/moves.svg`, movesPage, 'utf-8');

for (let i = 0; i < lastPokemonId; i++) {
	const name = PokemonNames[i].names.find((name) => {
		return name.en;
	});

	const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${
		i + 1
	}.png`;

	fetch(imageUrl)
		.then(async (res) => {
			return { buffer: await res.arrayBuffer(), status: res.status };
		})
		.then(({ buffer, status }) => {
			const base64Image = Buffer.from(buffer).toString('base64');
			const dataUrl = `data:image/jpeg;base64,${base64Image}`;

			const regex = /<image[^>]*>/;
			const newImageTag = `<image id="pokemonSprite" ${
				status === 404 ? 'style="display: none;"' : ''
			} x="50" y="20" width="45px" height="56px" xlink:href="${dataUrl}" />`;

			const fullData = pokemonFile
				.replace(regex, newImageTag)
				.replace(/Top Text/, 'Pokécompanion')
				.replace(/Bottom Text/, name.en);

			if (!fs.existsSync(`./static/socialpreview/pokemon/${i + 1}`)) {
				fs.mkdirSync(`./static/socialpreview/pokemon/${i + 1}`);
			}

			fs.writeFileSync(
				`./static/socialpreview/pokemon/${i + 1}/shiny-female.svg`,
				fullData,
				'utf-8'
			);

			const shinyMale = fullData.replace('id="female"', 'id="female" style="display: none;"');
			fs.writeFileSync(
				`./static/socialpreview/pokemon/${i + 1}/shiny-male.svg`,
				shinyMale,
				'utf-8'
			);

			const male = shinyMale.replace('id="shiny"', 'id="shiny" style="display: none;"');
			fs.writeFileSync(`./static/socialpreview/pokemon/${i + 1}/male.svg`, male, 'utf-8');

			const female = fullData.replace('id="shiny"', 'id="shiny" style="display: none;"');
			fs.writeFileSync(`./static/socialpreview/pokemon/${i + 1}/female.svg`, female, 'utf-8');

			const generic = female.replace('id="gender"', 'id="gender" style="display: none;"');
			fs.writeFileSync(`./static/socialpreview/pokemon/${i + 1}/generic.svg`, generic, 'utf-8');
		})
		.catch((err) => console.error(`Error fetching image: ${err}`));
}
// const template = fs.readFileSync('./misc/assets/social_preview.svg', 'utf-8');
// const outputLocation = './public/previews';

// if (!fs.existsSync(`${outputLocation}`)) fs.mkdirSync(`${outputLocation}`);

// if (!fs.existsSync(`${outputLocation}/pokemon`)) fs.mkdirSync(`${outputLocation}/pokemon`);

// const pkmn = JSON.parse(fs.readFileSync('./public/pokedata/pokemon.json', 'utf-8'));

// async function pkmnSvgToPng() {
// 	for (let i = 0; i < pkmn.length; i++) {
// 		await convertFile(`${outputLocation}/pokemon/${pkmn[i].id}.svg`, {
// 			width: 600,
// 			height: 315
// 		});
// 		fs.rmSync(`${outputLocation}/pokemon/${pkmn[i].id}.svg`);
// 		console.log(`Converted ${pkmn[i].id} to png`);
// 	}
// }

// function pkmnToSvg() {
// 	pkmn.forEach((mon, i) => {
// 		let entry = template.valueOf();
// 		entry = entry.replace('SECTION', 'Pokémon');
// 		const englishName = mon.names.filter((a) => Object.keys(a).includes('en'))[0];
// 		entry = entry.replace('ENTRY', `#${mon.id} ${englishName.en}`);

// 		fs.writeFileSync(`${outputLocation}/pokemon/${mon.id}.svg`, entry, 'utf-8');
// 	});
// }

// pkmnToSvg();
// pkmnSvgToPng();
