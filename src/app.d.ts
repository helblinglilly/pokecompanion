// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Locals {}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface Platform {
			ctx: { waitUntil(promise: Promise<unknown>): void };
			caches: {
				default: {
					match(request: Request): Promise<Response | undefined>;
					put(request: Request, response: Response): Promise<void>;
				};
			};
		}
	}

	interface Window {
		__pokecompanionFetchPatched?: boolean;
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
