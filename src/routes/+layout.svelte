<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';
	import { theme } from '$lib/domain';

	const changeTheme = (newTheme: 'dark' | 'light') => {
		const body = document.querySelector('body');
		if (!body) return;

		if (newTheme === 'dark' && !body.classList.contains('dark-theme')) {
			body.classList.add('dark-theme');
		} else if (newTheme === 'light' && body.classList.contains('dark-theme')) {
			body.classList.remove('dark-theme');
		}

		window.sessionStorage.setItem('theme', newTheme);
	};

	const toggleMobileNavExtended = () => {
		const navButtons = document.querySelectorAll('.navbar__button');
		navButtons.forEach((button) => button.classList.toggle('hidden--mobile'));
	};

	onMount(() => {
		const existingTheme = window.sessionStorage.getItem('theme') as 'dark' | 'light' | undefined;

		theme.subscribe((value: 'dark' | 'light' | undefined) => {
			if (!value) {
				return;
			}
			changeTheme(value);
		});
		if (existingTheme) {
			theme.set(existingTheme);
			return;
		}

		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme.set('dark');
		} else if (window.matchMedia('(prefers-color-scheme: light')) {
			theme.set('light');
		} else {
			theme.set('light');
		}
	});
</script>

<nav id="navbar" class="h-12">
	<a href="/" id="navbar__branding__link">
		<img src="https://pokemon.helbling.uk/static/favicon.png" alt="icon" height="auto" />
		<button>Pokécompanion</button>
	</a>

	<div class="navbar__links">
		<div style="display: grid;">
			<button id="navbar__hamburger" on:click={toggleMobileNavExtended}>
				<span class="navbar__hamburger__bar" />
				<span class="navbar__hamburger__bar" />
				<span class="navbar__hamburger__bar" />
			</button>
		</div>

		<a href="/test" class="navbar__button hidden--mobile" on:click={toggleMobileNavExtended}>
			<button>Test</button>
		</a>
		<button class="navbar__button hidden--mobile" on:click={toggleMobileNavExtended}
			>Different</button
		>
		<button class="navbar__button hidden--mobile" on:click={toggleMobileNavExtended}
			>Location</button
		>
		<button class="navbar__button hidden--mobile" on:click={toggleMobileNavExtended}
			>Different</button
		>

		<button
			class="navbar__button hidden--mobile"
			on:click={toggleMobileNavExtended}
			on:click={() => {
				if ($theme === 'light') {
					theme.set('dark');
				} else {
					theme.set('light');
				}
			}}>Theme</button
		>
	</div>
</nav>

<div id="pageWrapper">
	<p>{$theme}</p>
	<slot />
</div>

<style>
	/* Mobile only */
	@media screen and (max-width: 768px) {
		div.navbar__links > .navbar__button {
			width: 100%;
			padding-top: 10px;
			padding-bottom: 10px;
		}

		.navbar__button.hidden--mobile {
			display: none;
		}

		.navbar__links {
			padding-right: 0;
		}
	}

	/* Desktop only */
	@media screen and (min-width: 768px) {
		nav > div.navbar__links {
			justify-content: start;
			height: 100%;
		}

		#navbar__hamburger {
			display: none;
		}

		nav > div.navbar__links {
			flex-direction: row;
		}

		div.navbar__links > .navbar__button {
			padding-top: 10px;
			padding-bottom: 10px;
		}

		div.navbar__links > :last-child {
			margin-left: auto;
		}
	}
</style>
