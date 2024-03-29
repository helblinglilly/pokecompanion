import { PERSPECTIVES_API_KEY } from '$env/static/private';
import { Logger } from '$lib/log';
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

	try {
		const response = await fetch(`${endpoint}?key=${PERSPECTIVES_API_KEY}`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			throw new Error(`Non-200 response code - ${response.status}`);
		}

		const repsonseData = (await response.json()) as unknown as {
			attributeScores: {
				TOXICITY: {
					summaryScore: {
						value: number;
					};
				};
			};
		};
		toxicityScore = repsonseData.attributeScores.TOXICITY.summaryScore.value;
	} catch (err) {
		Logger.error(
			Logger.ErrorClasses.ExternalAPIRequestFailed,
			Logger.buildError(err),
			{
				context: 'Failed to check term for toxicity',
				term,
				outcome: 'User rejected'
			}
		)
	}

	if (toxicityScore >= 0.3){
		Logger.addPageAction('ToxicityDenied', 'Rejected toxic user content from being inserted', {
			term,
			toxicityScore,
		})
		return true;
	}

	return false;
};

export default isStringToxic;
