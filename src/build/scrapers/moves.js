import fs from 'fs';
import fetch from 'node-fetch';

const outputLocation = './src/lib/data/moves.json';

const getMaxAmount = async () => {
	try {
		const response = await fetch(`https://pokeapi.co/api/v2/move`);
		const body = await response.json();
		return body.count;
	} catch (err) {
		console.error('Failed to get max amount of pokemon');
		process.exit(-1);
	}
};

const moves = async () => {
	console.log('Scraping data for Moves...');
	const startFrom = 1;
	const upTo = await getMaxAmount();

	const results = [];

	for (let i = startFrom; i <= upTo; i++) {
		let response;
		let data;

		try {
			response = await fetch(`https://pokeapi.co/api/v2/move/${i}`, {
				headers: { 'Accept-Encoding': 'gzip,deflate,compress' }
			});
			data = await response.json();
			console.log(i);
		} catch (err) {
			console.log(i, 'failed', err);
			continue;
		}

		const names = [];
		data.names.forEach((entry) => {
			const languageCode = entry.language.name;
			const name = entry.name;
			names.push({ [languageCode]: name });
		});

		results.push({
			names: names,
			id: i,
			english_id: data.name,
			attack_type: data.damage_class.name,
			type: data.type.name
		});
		await new Promise((r) => setTimeout(r, 500));
	}
	fs.writeFileSync(outputLocation, JSON.stringify(results), 'utf8');
};

moves();

export default moves;
