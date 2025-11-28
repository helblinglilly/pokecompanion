// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Locals {}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		export interface Platform {
			Search: D1Database;
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}

	interface Window {
		newrelic?: {
			addPageAction: (name: string, attributes?: object) => void;
			noticeError: (error: Error, attributes?: object) => void;
			setCustomAttribute: (name: string, value: unknown) => void;
			setUserId: (value: string | null) => void;
		};
		/**
		 * https://umami.is/docs/tracker-functions
		 */
		umami?: {
			/**
			 * Identify the current user
			 */
			identify: (unique_id: string | object, data?: object) => void;
			/**
			 *  Track a custom event
			 */
			track: (event_name?: string | object, data?: object) => void;
		};
	}
}

export {};
