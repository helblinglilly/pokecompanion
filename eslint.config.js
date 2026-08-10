import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import svelteConfig from './svelte.config.js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
	{
		ignores: ['.svelte-kit/**', 'build/**', 'node_modules/**']
	},
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		rules: {
			'svelte/no-at-html-tags': 'off',
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/no-useless-mustaches': 'off',
			'svelte/prefer-svelte-reactivity': 'off',
			'svelte/require-each-key': 'off',
			'svelte/valid-prop-names-in-kit-pages': 'off'
		}
	},
	prettier
];
