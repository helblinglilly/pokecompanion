import * as Sentry from '@sentry/browser';
/* https://github.com/getsentry/sentry-javascript/issues/8291 */
import { PUBLIC_AXIOM_TOKEN, PUBLIC_AXIOM_DATASET } from '$env/static/public';

const apiUrl = `https://api.axiom.co/v1/datasets/${PUBLIC_AXIOM_DATASET}/ingest`;

const logToAxiom = (other: object) => {
	fetch(apiUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${PUBLIC_AXIOM_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify([
			{
				_time: new Date().toISOString(),
				data: {
					application: 'pokecompanion',
					...other
				}
			}
		])
	}).catch((error) => console.error('Error:', error));
};

const error = (message: string, errorId: string, details?: unknown) => {
	const timestamp = new Date().toISOString();
	const level = 'ERROR';

	Sentry.captureMessage(message, {
		level: 'error',
		extra: {
			errorId,
			details
		}
	});

	if (!details) details = '';

	console.error(timestamp, level, errorId, `'${message}'`, details);
	logToAxiom({ action: 'log', level: 'error', message: message });
};

const info = (message: string) => {
	const timestamp = new Date().toISOString();
	const level = 'INFO';

	console.info(timestamp, level, message);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const warn = (message: string, extra: any) => {
	const timestamp = new Date().toISOString();
	const level = 'WARN';

	Sentry.captureMessage(message, {
		level: 'warning',
		extra
	});
	console.warn(timestamp, level, message);
};

export { error, info, warn, logToAxiom };
