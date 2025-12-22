import { PUBLIC_ENVIRONMENT } from '$env/static/public';

enum ErrorClasses {
	ExternalAPIRequestFailed = 'External API Request Failed',
	OptionalOperationFailed = 'Optional Operation Failed',
	RuntimeError = 'Runtime error',
	SearchResults = 'SearchResultsError',
	TagOperation = 'TagOperationError',
	TeamOperation = 'TeamOperationError',
	UserOperation = 'UserOperationError',
	Unknown = 'Unknown'
}

interface Info {
	context?: string;
	[key: string]: unknown;
}

export class Logger {
	static ErrorClasses = ErrorClasses;

	static buildError(err: unknown) {
		return err instanceof Error ? err : new Error(String(err));
	}

	static async error(errorClass: ErrorClasses, error: Error, info?: Info) {
		if (PUBLIC_ENVIRONMENT === 'local') {
			console.error(errorClass, error, info);
		}
	}

	static async info(message: string, info?: Info) {
		if (PUBLIC_ENVIRONMENT === 'local') {
			console.info(message, info);
		}
	}

	static async warn(message: string, info?: Info) {
		if (PUBLIC_ENVIRONMENT === 'local') {
			console.warn(message, info);
		}
	}

	static async addPageAction(name: string, details?: object) {
		if (PUBLIC_ENVIRONMENT === 'local') {
			console.debug('PageAction', name, details);
		}
		if (typeof window !== 'undefined') {
			if (window?.umami) {
				window.umami.track(name, details);
			}
		}
	}
}
