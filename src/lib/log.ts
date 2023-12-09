import * as Sentry from '@sentry/browser';
/* https://github.com/getsentry/sentry-javascript/issues/8291 */
// import * as Sentry from '@sentry/sveltekit';

const error = (message: string, errorId: string, status?: string, details?: string) => {
	const timestamp = new Date().toISOString();
	const level = 'ERROR';

	Sentry.captureMessage(message, {
		level: 'error',
		extra: {
			errorId,
			status,
			details
		}
	});

	if (!status) status = '';
	if (!details) details = '';

	console.error(timestamp, level, errorId, `'${message}'`, status, details);
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

export { error, info, warn };
