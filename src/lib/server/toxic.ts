import { PERSPECTIVES_API_KEY } from '$env/static/private';
const endpoint = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

const isStringToxic = async (term: string) => {
	const normalisedTerm = term
		.toLowerCase()
		.replaceAll(' ', '')
		.replaceAll('0', 'o')
		.replaceAll('1', 'i')
		.replaceAll('3', 'e')
		.replaceAll('4', 'a')
		.replaceAll('5', 's')
		.replaceAll('7', 'l');

	const data = {
		comment: { text: normalisedTerm },
		languages: ['en'],
		requestedAttributes: { TOXICITY: {} }
	};

	let toxicityScore = 1;

	const response = await fetch(`${endpoint}?key=${PERSPECTIVES_API_KEY}`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		const repsonseData = await response.json();
		toxicityScore = repsonseData.attributeScores.TOXICITY.summaryScore.value;
	} else {
		console.error('Error while checking term:', await response.text());
	}

	return toxicityScore >= 0.3;
};

export default isStringToxic;
