// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Locals {}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// export interface Platform {}
	}

	interface Window {
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
