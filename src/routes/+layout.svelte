<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';
	import { cookieHandlers, theme } from '$lib/stores/domain';
	import { page } from '$app/stores';
	import { notifications, removeNotification } from '$lib/stores/notifications';
	import { currentUser, type SignedInUser } from '$lib/stores/user';
	import type { PageData } from './$types';
	import SearchBar from '$/components/Search/SearchBar.svelte';
	import Tracking from '$/components/Tracking.svelte';
	import ScrollToTop from '$/components/UI/ScrollToTop.svelte';
	import Navbar from '$/components/UI/Navbar/Navbar.svelte';

	export let data: PageData;
	export let breadcrumbs: { display: string; url: string }[] = [];

	$: currentUser.set(data.user as SignedInUser);

	const initTheme = () => {
		const changeTheme = (newTheme: 'dark' | 'light') => {
			const body = document.querySelector('body');
			if (!body) return;

			if (newTheme === 'dark' && !body.classList.contains('dark-theme')) {
				body.classList.add('dark-theme');
				document.documentElement.classList.add('dark');
			} else if (newTheme === 'light' && body.classList.contains('dark-theme')) {
				body.classList.remove('dark-theme');
				document.documentElement.classList.remove('dark');
			}

			window.sessionStorage.setItem('theme', newTheme);
		};

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
	};

	const fixImages = () => {
		// Replace all failed images with placeholder
		const images = document.querySelectorAll('img');
		images.forEach((image) => {
			if (!image.src) {
				image.src = '/placeholder.png';
			}
			image.addEventListener('error', () => {
				if (image.src !== '/placeholder.png') {
					image.srcset = '/placeholder.png';
				}
			});
		});
	};

	onMount(() => {
		initTheme();
		// Initialise all cookies and stores
		for (const value of Object.values(cookieHandlers)) {
			value();
		}
		fixImages();
	});

	$: currentPage = $page.url.pathname + $page.url.search + $page.url.hash;

	$: shouldDisplaySearch = !['/auth/', '/about', '/privacy'].some((noSearchBar) => {
		return $page.url.pathname.includes(noSearchBar);
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="/global.css" />
</svelte:head>

<Tracking />

<ScrollToTop />

<Navbar />

{#if $notifications.length > 0}
	<div class="notifications">
		{#each $notifications as notification}
			<button
				class={`notification ${notification.level}`}
				on:click={() => {
					removeNotification(notification);
				}}
			>
				{notification.message}
			</button>
		{/each}
	</div>
{/if}

<div id="pageWrapper">
	{#if shouldDisplaySearch}
		<SearchBar />
		{#if breadcrumbs.length > 0 && $page.status === 200}
			<div style="display: inline-flex; margin-bottom: 2rem;">
				{#each breadcrumbs as crumb}
					{#if breadcrumbs.indexOf(crumb) < breadcrumbs.length - 1}
						<a href={crumb.url}>{crumb.display}</a>
						<p style="margin-left: 5px; margin-right: 5px;">/</p>
					{:else}
						<p>{crumb.display}</p>
					{/if}
				{/each}
			</div>
		{/if}
	{/if}
	<slot />
</div>

<footer id="pageFooter">
	<p>Powered by <a href="https://pokeapi.co" class="underline">PokéAPI</a></p>
	<p>
		Built at <a href="https://github.com/helblinglilly/pokecompanion" class="underline"
			>github.com/helblinglilly/pokecompanion</a
		>
	</p>
	<p>Pokémon and Pokémon character names are trademarks of Nintendo.</p>
	<p>This site is not associated with Nintendo, Gamefreak, The Pokémon Company or PokéAPI</p>
</footer>

<style>
	#navbar {
		display: flex;
		background-color: var(--branding-secondary);
	}

	#navbar__hamburger {
		background-color: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		justify-self: end;
		width: 30px;
		height: 3rem;
		padding-top: 12px;
		padding-bottom: 12px;
		margin-right: 12px;
		justify-content: center;
	}

	.navbar__hamburger__bar {
		color: var(--light);
		background-color: var(--light);
		height: 3px;
		width: 100%;
		transition: background-color 0.3s ease-in-out;
	}

	.navbar__links {
		z-index: 1;
		flex-direction: column;
		background-color: var(--branding-secondary);
		height: fit-content;
		width: 100%;
		justify-content: flex-end;
		display: flex;
		padding-right: 1rem;
	}

	.navbar__button {
		height: 100%;
		padding-left: 1rem;
		padding-right: 1rem;
		color: var(--light);
		background-color: var(--branding-secondary);
	}

	.navbar__button:hover,
	button:hover,
	#navbar__branding__link:hover {
		background-color: var(--dark);
		color: var(--light);
	}

	.navbar__button > button {
		width: 100%;
		height: 100%;
		color: var(--light);
	}

	.navbar__button > button {
		color: var(--light);
	}

	#navbar__branding__link {
		display: inline-flex;
		width: min-content;
		text-decoration-line: none;
		padding: 10px;
	}

	#navbar__branding__link > button {
		width: max-content;
		display: inline-flex;
		color: var(--light);
	}

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
