import fs from 'fs';
import fetch from 'node-fetch';
import PokemonNames from '../src/lib/data/pokemonNames.json' assert { type: 'json' };
import sharp from 'sharp';

const genericFile = fs.readFileSync('./assets/pokemonPreview.svg', 'utf-8');

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

function convertSvgToPng(svgContent, pngFilePath, width, height, overlayBuffer) {
	const image = sharp(Buffer.from(svgContent), { density: 300 }) // Set density for better quality (optional)
		.resize(width, height);
	if (overlayBuffer) {
		sharp(overlayBuffer)
			.resize({ width: 280, height: 280 }) // Scale the image by 2x
			.toBuffer()
			.then((scaledOverlayBuffer) => {
				image.composite([{ input: scaledOverlayBuffer, top: 340, left: 900 }]); // Adjust top and left values as needed
				image.toFile(pngFilePath, (err, info) => {
					if (err) {
						console.error('Error converting SVG to PNG:', err, info);
					}
				});
			})
			.catch((err) => {
				console.log(`Failure when overlaying image ${pngFilePath} - ${err}`);
			});
	} else {
		image.toFile(pngFilePath, (err, info) => {
			if (err) {
				console.error('Error converting SVG to PNG:', err, info);
			}
		});
	}
}

if (!fs.existsSync('./static/socialpreview')) {
	fs.mkdirSync('./static/socialpreview');
}
if (!fs.existsSync('./static/socialpreview/pokemon')) {
	fs.mkdirSync('./static/socialpreview/pokemon');
}

const topTspanTag = `<tspan x="105.762px 192.608px 231.96px 271.312px 358.159px 500.311px 536.663px 613.927px 700.774px 778.039px " y="0px 0px 0px 0px 0px 0px 0px 0px 0px 0px ">`;
const bottomTspanTag = `<tspan x="105.762px 192.608px 231.96px 271.312px 358.159px 500.311px 536.663px 613.927px 700.774px 778.039px " y="0px 0px 0px 0px 0px 0px 0px 0px 0px 0px ">`;

const generic = genericFile
	.replace(/bottom-text"/, '" style="display: none;"')
	.replace(/top-text"/, '" style="display: none;"')
	.replace(/single-modifier"/, '" style="display: none;"')
	.replace(/double-modifier"/, '" style="display: none;"');
convertSvgToPng(generic, `./static/socialpreview/generic.png`, 1200, 630);

const home = genericFile
	.replace(`Bottom Text`, `Homepage`)
	.replace(/centered-text"/, '" style="display: none;"')
	.replace(/single-modifier"/, '" style="display: none;"')
	.replace(/double-modifier"/, '" style="display: none;"');
convertSvgToPng(home, `./static/socialpreview/home.png`, 1200, 630);

const about = genericFile
	.replace(`Bottom Text`, `About`)
	.replace(/centered-text"/, '" style="display: none;"')
	.replace(/single-modifier"/, '" style="display: none;"')
	.replace(/double-modifier"/, '" style="display: none;"');
convertSvgToPng(about, `./static/socialpreview/about.png`, 1200, 630);

const settings = genericFile
	.replace(`Bottom Text`, `Settings`)
	.replace(/centered-text"/, '" style="display: none;"')
	.replace(/single-modifier"/, '" style="display: none;"')
	.replace(/double-modifier"/, '" style="display: none;"');
convertSvgToPng(settings, `./static/socialpreview/settings.png`, 1200, 630);

const results = genericFile
	.replace(`Bottom Text`, `Search Results`)
	.replace(/centered-text"/, '" style="display: none;"')
	.replace(/single-modifier"/, '" style="display: none;"')
	.replace(/double-modifier"/, '" style="display: none;"');
convertSvgToPng(results, `./static/socialpreview/results.png`, 1200, 630);

const pokemonPage = genericFile
	.replace(`Bottom Text`, `Pokémon`)
	.replace(/centered-text"/, '" style="display: none;"')
	.replace(/single-modifier"/, '" style="display: none;"')
	.replace(/double-modifier"/, '" style="display: none;"');

convertSvgToPng(pokemonPage, `./static/socialpreview/pokemonPage.png`, 1200, 630);

const movesPage = genericFile
	.replace(`Bottom Text`, `Moves`)
	.replace(/centered-text"/, '" style="display: none;"')
	.replace(/single-modifier"/, '" style="display: none;"')
	.replace(/double-modifier"/, '" style="display: none;"');
convertSvgToPng(movesPage, `./static/socialpreview/moves.png`, 1200, 630);

// for (let i = 0; i < 1; i++) {
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
			const plainFile = genericFile
				.replace(`Bottom Text`, name.en)
				.replace(/centered-text"/, '" style="display: none;"')
				.replace(/single-modifier"/, '" style="display: none;"')
				.replace(/double-modifier"/, '" style="display: none;"');

			if (!fs.existsSync(`./static/socialpreview/pokemon/${i + 1}`)) {
				fs.mkdirSync(`./static/socialpreview/pokemon/${i + 1}`);
			}

			convertSvgToPng(
				plainFile,
				`./static/socialpreview/pokemon/${i + 1}/generic.png`,
				1200,
				630,
				status === 200 ? buffer : undefined
			);

			const shiny = genericFile
				.replace(`Bottom Text`, name.en)
				.replace(/centered-text"/, '" style="display: none;"')
				.replace(/single-male"/, '" style="display: none;"')
				.replace(/single-female"/, '" style="display: none;"')
				.replace(/double-modifier"/, '" style="display: none;"');

			convertSvgToPng(
				shiny,
				`./static/socialpreview/pokemon/${i + 1}/shiny.png`,
				1200,
				630,
				status === 200 ? buffer : undefined
			);

			const male = genericFile
				.replace(`Bottom Text`, name.en)
				.replace(/centered-text"/, '" style="display: none;"')
				.replace(/single-shiny"/, '" style="display: none;"')
				.replace(/single-female"/, '" style="display: none;"')
				.replace(/double-modifier"/, '" style="display: none;"');

			convertSvgToPng(
				male,
				`./static/socialpreview/pokemon/${i + 1}/male.png`,
				1200,
				630,
				status === 200 ? buffer : undefined
			);

			const female = genericFile
				.replace(`Bottom Text`, name.en)
				.replace(/centered-text"/, '" style="display: none;"')
				.replace(/single-shiny"/, '" style="display: none;"')
				.replace(/single-male"/, '" style="display: none;"')
				.replace(/double-modifier"/, '" style="display: none;"');

			convertSvgToPng(
				female,
				`./static/socialpreview/pokemon/${i + 1}/female.png`,
				1200,
				630,
				status === 200 ? buffer : undefined
			);

			const maleShiny = genericFile
				.replace(`Bottom Text`, name.en)
				.replace(/centered-text"/, '" style="display: none;"')
				.replace(/double-female"/, '" style="display: none;"')
				.replace(/single-modifier"/, '" style="display: none;"');

			convertSvgToPng(
				maleShiny,
				`./static/socialpreview/pokemon/${i + 1}/shiny-male.png`,
				1200,
				630,
				status === 200 ? buffer : undefined
			);

			const femaleShiny = genericFile
				.replace(`Bottom Text`, name.en)
				.replace(/centered-text"/, '" style="display: none;"')
				.replace(/double-male"/, '" style="display: none;"')
				.replace(/single-modifier"/, '" style="display: none;"');

			convertSvgToPng(
				femaleShiny,
				`./static/socialpreview/pokemon/${i + 1}/shiny-female.png`,
				1200,
				630,
				status === 200 ? buffer : undefined
			);
		})
		.catch((err) => console.error(`Error fetching image: ${err}`));
}
