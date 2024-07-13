import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-svelte-csf',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/addon-interactions',
		'@storybook/addon-themes',
		'@storybook/addon-essentials',
		{
			name: '@storybook/addon-styling',
			options: {
				postCss: {
					implementation: require('postcss')
				}
			}
		}
	],
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	}
};
export default config;
