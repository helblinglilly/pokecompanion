/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class', // Enable dark mode with the 'class' strategy
	theme: {
	  extend: {
		colors: {
			primary: {
				DEFAULT: 'var(--primary)',
				dark: 'var(--primary)'
			},
			secondary: {
				DEFAULT: 'var(--secondary)',
				dark: 'var(--secondary)'
			},
			accent: {
				DEFAULT: 'var(--accent)',
				dark: 'var(--accent)'
			},
			textColour: {
				DEFAULT: 'var(--dark)',
				dark: 'var(--light)'
			},
			textInverse: {
				DEFAULT: 'var(--light)',
				dark: 'var(--dark)'
			},
			navbar: {
				DEFAULT: 'var(--branding-secondary)'
			},
			dark: {
				DEFAULT: 'var(--dark)'
			}
		},
	  },
	},
	plugins: [],
  };