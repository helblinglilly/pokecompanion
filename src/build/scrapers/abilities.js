import fs from 'fs';
import fetch from 'node-fetch';

const outputLocation = './src/lib/data/abilities.json';

const abilities = async () => {
	console.log('Scraping data for Abilities...');
	const startFrom = 10012;
	const upTo = 10060;

	const results = [];

	for (let i = startFrom; i <= upTo; i++) {
		let response;
		let data;

		try {
			response = await fetch(`https://pokeapi.co/api/v2/ability/${i}`, {
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
			id: i
		});
		await new Promise((r) => setTimeout(r, 500));
	}
	fs.writeFileSync(outputLocation, JSON.stringify(results), 'utf8');
};

abilities();

export default abilities;
