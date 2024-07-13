<script lang="ts">
	import '../app.css';
	import '$/styles/global.css';

	import { onMount } from 'svelte';
	import { cookieHandlers, theme } from '$lib/stores/domain';
	import { page } from '$app/stores';
	import { notifications, removeNotification } from '$lib/stores/notifications';
	import { currentUser, type SignedInUser } from '$lib/stores/user';
	import type { PageData } from './$types';
	import SearchBar from '$/components/Search/SearchBar.svelte';
	import Tracking from '$/components/Tracking.svelte';
	import ScrollToTop from '$/components/UI/ScrollToTop.svelte';
	import Navbar from '$/ui/organisms/Navbar';

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

	$: shouldDisplaySearch = !$page.url.pathname.includes('/auth/');
</script>

<svelte:head>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
	</style>
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
