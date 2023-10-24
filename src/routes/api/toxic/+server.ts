import { getSearchParam } from '../helpers';
import { PERSPECTIVES_API_KEY } from '$env/static/private';

export async function GET({ request }) {
	const term = getSearchParam(request.url, 'term');

	let toxicityScore = 1;

	const endpoint = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

	const data = {
		comment: { text: term },
		languages: ['en', 'it'],
		requestedAttributes: { TOXICITY: {} }
	};

	const response = await fetch(`${endpoint}?key=${PERSPECTIVES_API_KEY}`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		const responseData = await response.json();
		toxicityScore = responseData.attributeScores.TOXICITY.summaryScore.value;
	} else {
		console.error('Error while checking username:', await response.text());
		toxicityScore = 1;
	}

	return new Response(JSON.stringify({ score: toxicityScore }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
