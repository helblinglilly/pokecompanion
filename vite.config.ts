import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

const API_HOST = process.env.PUBLIC_API_HOST ?? 'https://api.pokecompanion.com';
const IS_DEV = process.env.NODE_ENV === 'development';

export default defineConfig({
	plugins: [
		sveltekit({
			// Consult https://kit.svelte.dev/docs/integrations#preprocessors
			// for more information about preprocessors
			preprocess: vitePreprocess(),

			// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
			// If your environment is not supported or you settled on a specific environment, switch out the adapter.
			// See https://kit.svelte.dev/docs/adapters for more information about adapters.
			adapter: adapter({ routes: { include: ['/*'], exclude: ['<all>'] } }),
			alias: { $: resolve('./src') }
		}),
		tailwindcss()
	],
	server: {
		proxy: IS_DEV ? {
				'/proxy': {
					target: API_HOST,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/proxy/, '')
				}
		} : {}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	define: {
		'process.browser': true
	},
	...(process.env.VITEST
		? {
				resolve: {
					conditions: ['browser']
				}
			}
		: {})
});
