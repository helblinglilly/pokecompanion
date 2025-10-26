<script lang="ts">
	import '$/styles/global.css';

	import { onMount } from 'svelte';
	import { cookieHandlers, theme } from '$lib/stores/domain';
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import { notifications } from '$lib/stores/notifications';
	import { currentUser, type SignedInUser } from '$lib/stores/user';
	import type { PageData } from './$types';
	import SearchBar from '$/lib/components/SearchBar.svelte';
	import Tracking from '$/lib/components/Tracking.svelte';
	import Navbar from '$/ui/organisms/Navbar';
	import Footer from '$/ui/atoms/footer/Footer.svelte';
	import Notification from '$/ui/molecules/notification/Notification.svelte';
	import ScrollToTop from '$/lib/components/ScrollToTop.svelte';
	import { PUBLIC_ENVIRONMENT } from '$env/static/public';

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

	$: shouldDisplaySearch = !['/auth/', '/about', '/privacy'].some((noSearchBar) => {
		return $page.url.pathname.includes(noSearchBar);
	});
</script>

<svelte:head>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
	</style>

	{#if PUBLIC_ENVIRONMENT === 'production'}
		<script
			defer
			src="https://analytics.helbling.uk/script.js"
			data-website-id="f303cb13-d1aa-42c0-ab5b-77937e5a1daa"
		></script>
	{/if}
</svelte:head>

<Tracking />

<ScrollToTop />

<div style="min-height: 88vh;">
	<Navbar />

	{#if $notifications.length > 0}
		<div class="px-4 grid gap-4 absolute z-10 w-full md:px-24">
			{#each $notifications as notification}
				<Notification {notification} />
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
</div>

<Footer />
