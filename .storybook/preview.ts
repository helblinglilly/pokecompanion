import type { Preview } from '@storybook/svelte';
import { withThemeByClassName } from '@storybook/addon-themes';
import { Renderer } from 'storybook/internal/types';
import BackgroundDecorator from './BackgroundDecorator.svelte'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		backgrounds: {
			default: 'default',
			values: [
				{ name: 'default', value: 'var(--site-background)'},
				{ name: 'light', value: 'rgb(225, 221, 221)'},
				{ name: 'dark', value: 'rgb(43, 43, 43)'}
			]
		}
	},
	decorators: [
		// @ts-ignore
		withThemeByClassName<Renderer>({
			themes: {
				light: '',
				dark: 'dark-theme'
			},
			defaultTheme: 'light'
		}),
		// @ts-ignore
		() => BackgroundDecorator
	]
};

export default preview;
