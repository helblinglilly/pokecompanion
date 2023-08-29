const error = (message: string, errorId: string, status?: string, details?: string) => {
	const timestamp = new Date().toISOString();
	const level = 'ERROR';

	if (!status) status = '';
	if (!details) details = '';

	console.error(timestamp, level, errorId, `'${message}'`, status, details);
};

const info = (message: string) => {
	const timestamp = new Date().toISOString();
	const level = 'INFO';

	console.info(timestamp, level, message);
};

const warn = (message: string) => {
	const timestamp = new Date().toISOString();
	const level = 'WARN';

	console.info(timestamp, level, message);
};

export { error, info, warn };
