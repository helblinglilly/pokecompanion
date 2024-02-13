import fs from 'fs';
import fetch from 'node-fetch';
import PokemonNames from '../src/lib/data/pokemonNames.json' assert { type: 'json' };
import pkg from 'convert-svg-to-png';
const { convert } = pkg;

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

function convertSvgToPng(svgContent, pngFilePath, width, height) {
	return convert(svgContent, {
		allowDeprecatedAttributes: true,
		width,
		height
	}).then((pngBuffer) => {
		fs.writeFileSync(pngFilePath, pngBuffer);
	});
}

if (!fs.existsSync('./static/socialpreview')) {
	fs.mkdirSync('./static/socialpreview');
}
if (!fs.existsSync('./static/socialpreview/pokemon')) {
	fs.mkdirSync('./static/socialpreview/pokemon');
}

const generic = genericFile.replace(/Top Text/, 'Pokécompanion').replace(/Bottom Text/, '');
convertSvgToPng(generic, `./static/socialpreview/generic.png`, 1200, 630).then(() => {
	console.log(`Saved - ./static/socialpreview/generic.png`);
});

const home = genericFile.replace(/Top Text/, 'Pokécompanion').replace(/Bottom Text/, 'Homepage');
convertSvgToPng(home, `./static/socialpreview/home.png`, 1200, 630).then(() => {
	console.log(`Saved - ./static/socialpreview/home.png`);
});

const about = genericFile.replace(/Top Text/, 'Pokécompanion').replace(/Bottom Text/, 'About');
convertSvgToPng(about, `./static/socialpreview/about.png`, 1200, 630).then(() => {
	console.log(`Saved - ./static/socialpreview/about.png`);
});

const settings = genericFile
	.replace(/Top Text/, 'Pokécompanion')
	.replace(/Bottom Text/, 'Settings');
convertSvgToPng(settings, `./static/socialpreview/settings.png`, 1200, 630).then(() => {
	console.log(`Saved - ./static/socialpreview/settings.png`);
});

const results = genericFile
	.replace(/Top Text/, 'Pokécompanion')
	.replace(/Bottom Text/, 'Search Results');
convertSvgToPng(results, `./static/socialpreview/results.png`, 1200, 630).then(() => {
	console.log(`Saved - ./static/socialpreview/results.png`);
});

const pokemonPage = genericFile
	.replace(/Top Text/, 'Pokécompanion')
	.replace(/Bottom Text/, 'Pokémon');

convertSvgToPng(pokemonPage, `./static/socialpreview/pokemonPage.png`, 1200, 630).then(() => {
	console.log(`Saved - ./static/socialpreview/pokemonPage.png`);
});

const movesPage = genericFile.replace(/Top Text/, 'Pokécompanion').replace(/Bottom Text/, 'Moves');
convertSvgToPng(movesPage, `./static/socialpreview/moves.png`, 1200, 630).then(() => {
	console.log(`Saved - ./static/socialpreview/moves.png`);
});

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

			convertSvgToPng(
				fullData,
				`./static/socialpreview/pokemon/${i + 1}/shiny-female.png`,
				1200,
				630
			).then(() => {
				console.log(`Saved - ./static/socialpreview/pokemon/${i + 1}/shiny-female.png`);
			});

			const shinyMale = fullData.replace('id="female"', 'id="female" style="display: none;"');
			convertSvgToPng(
				shinyMale,
				`./static/socialpreview/pokemon/${i + 1}/shiny-male.png`,
				1200,
				630
			).then(() => {
				console.log(`Saved - ./static/socialpreview/pokemon/${i + 1}/shiny-male.png`);
			});

			const male = shinyMale.replace('id="shiny"', 'id="shiny" style="display: none;"');
			convertSvgToPng(male, `./static/socialpreview/pokemon/${i + 1}/male.png`, 1200, 630).then(
				() => {
					console.log(`Saved - ./static/socialpreview/pokemon/${i + 1}/male.svg`);
				}
			);

			const female = fullData.replace('id="shiny"', 'id="shiny" style="display: none;"');
			convertSvgToPng(female, `./static/socialpreview/pokemon/${i + 1}/female.png`, 1200, 630).then(
				() => {
					console.log(`Saved - ./static/socialpreview/pokemon/${i + 1}/female.png`);
				}
			);

			const generic = female.replace('id="gender"', 'id="gender" style="display: none;"');
			convertSvgToPng(
				generic,
				`./static/socialpreview/pokemon/${i + 1}/generic.png`,
				1200,
				630
			).then(() => {
				console.log(`Saved - ./static/socialpreview/pokemon/${i + 1}/generic.png`);
			});
		})
		.catch((err) => console.error(`Error fetching image: ${err}`));
}
