import { PUBLIC_LOGGING_API_KEY } from '$env/static/public';

enum ErrorClasses {
	ExternalAPIRequestFailed = 'External API Request Failed',
	OptionalOperationFailed = 'Optional Operation Failed',
	RuntimeError = 'Runtime error',
	SearchResults = 'SearchResultsError',
	TagOperation = 'TagOperationError',
	UserOperation = 'UserOperationError',
	Unknown = 'Unknown'
}

interface Info {
	context?: string;
	[key: string]: unknown;
}

export class Logger {
	static ErrorClasses = ErrorClasses;

	static buildError (err: unknown){
		return err instanceof Error ? err : new Error(String(err))
	}

	static async error(errorClass: ErrorClasses, error: Error, info?: Info){
		console.error(new Date().toISOString(), 'error',  errorClass, info, error)
	
		if (typeof window !== 'undefined'){
			if (window?.newrelic){
				window.newrelic.noticeError(error, {
					errorClass,
					info
				})
				window.newrelic?.addPageAction('ClientSideLog', {
					level: 'error',
					errorClass,
					info,
				})
				return;
			}
		}

		try {
			const res = await fetch('https://develop.pokecompanion.pages.dev/api/log', {
				method: 'POST',
				headers: {
					'Authentication': PUBLIC_LOGGING_API_KEY,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					eventType: 'ServerSideLog',
					level: 'error',
					error: {
						name: error.name,
						message: error.message
					},
					info
				})
			})
			if (!res.ok){
				throw new Error(`Non-200 response code - ${res.status}`)
			}
		} catch(err){
			console.log('Server Side Log: Failed to log error', errorClass, error, info, err)
		}
	};
	
	static async info(message: string, info?: Info){
		console.info(new Date().toISOString(), 'info',  message)
	
		if (typeof window !== 'undefined'){
			if (window?.newrelic){
				window.newrelic?.addPageAction('ClientSideLog', {
					level: 'info',
					message,
					info,
				})
				return;
			}
		}
		
		
		try {
			const res = await fetch('https://develop.pokecompanion.pages.dev/api/log', {
				method: 'POST',
				headers: {
					'Authentication': PUBLIC_LOGGING_API_KEY,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					eventType: 'ServerSideLog',
					level: 'warning',
					message,
					info
				})
			})
			if (!res.ok){
				throw new Error(`Non-200 response code - ${res.status}`)
			}
		} catch(err){
			console.log('Server Side Log: Failed to log info', message, info, err)
		}
	};
	
	static async warn(message: string, info?: Info){
		console.warn(new Date().toISOString, 'warning', message, info);
		
		if (typeof window !== 'undefined'){
			if (window?.newrelic){
				window.newrelic?.addPageAction('ClientSideLog', {
					level: 'warning',
					message,
					info,
				})
				return;
			}
		}
		
		try {
			const res = await fetch('https://develop.pokecompanion.pages.dev/api/log', {
				method: 'POST',
				headers: {
					'Authentication': PUBLIC_LOGGING_API_KEY,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					eventType: 'ServerSideLog',
					level: 'warning',
					message,
					info
				})
			})
			if (!res.ok){
				throw new Error(`Non-200 response code - ${res.status}`)
			}
		} catch(err){
			console.log('Server Side Log: Failed to log warning', message, info, err)
		}

	};
	
	static async addPageAction(name: string, message: string, info?: Info){
		console.info(new Date().toISOString, 'notice', message, info);
		
		if (typeof window !== 'undefined'){
			if (window?.newrelic){
				window.newrelic?.addPageAction(name, {
					message,
					info,
				})
				return;
			}
		}

		try {
			const res = await fetch('https://develop.pokecompanion.pages.dev/api/log', {
				method: 'POST',
				headers: {
					'Authentication': PUBLIC_LOGGING_API_KEY,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					eventType: name,
					message,
					info
				})
			})
			if (!res.ok){
				throw new Error(`Non-200 response code - ${res.status}`)
			}
		} catch(err){
			console.log('Server Side Log: Failed to log page action', name, message, info, err)
		}
	}
}
