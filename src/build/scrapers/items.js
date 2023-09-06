import fs from 'fs';
import fetch from 'node-fetch';

const outputLocation = './src/lib/data/items.json';

const items = async () => {
	console.log('Scraping data for Items...');
	const startFrom = 1;
	const upTo = 2050;

	const results = [];
	const failures = [];
	for (let i = startFrom; i <= upTo; i++) {
		let response;
		let data;
		try {
			response = await fetch(`https://pokeapi.co/api/v2/item/${i}`, {
				headers: { 'Accept-Encoding': 'gzip,deflate,compress' }
			});
			data = await response.json();
			console.log(i);
		} catch (err) {
			console.log(i, 'failed', err);
			failures.push(i);
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
			name: data.name,
			id: i
		});
		await new Promise((r) => setTimeout(r, 500));
	}
	fs.writeFileSync(outputLocation, JSON.stringify(results), 'utf8');
	fs.writeFileSync('itemFailures.json', JSON.stringify(failures), 'utf-8');
};

items();

export default items;
