// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			pb: import('pocketbase').default;
			user: import('pocketbase').default['authStore']['model'];
		}
		interface Error {
			message: string;
			errorId: string;
		}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
