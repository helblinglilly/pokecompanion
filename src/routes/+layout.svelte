<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';
	import { cookieHandlers, theme } from '$lib/domain';
	import { page } from '$app/stores';
	import { notifications } from '$lib/notifications';

	let isMobileMenuExpanded = false;

	const toggleMobileNavExtended = () => {
		const navButtons = document.querySelectorAll('.navbar__button');
		navButtons.forEach((button, i) => {
			if (i === 0) {
				isMobileMenuExpanded = button.classList.contains('hidden--mobile');
			}
			button.classList.toggle('hidden--mobile');
		});
	};

	const initTheme = () => {
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
			image.addEventListener('error', () => {
				image.src = '/placeholder.png';
			});
		});
	};

	onMount(() => {
		initTheme();
		// Initialise all cookies
		for (const value of Object.values(cookieHandlers)) {
			value();
		}
		fixImages();
	});

	$: breadcrumbs = $page.url.pathname
		.split('/')
		.filter((a) => a)
		.map((part, i, arr) => {
			let displayEntry = '';
			if (i > 1) {
				displayEntry += ' / ';
			}
			displayEntry += part[0].toUpperCase() + part.slice(1);

			const urlSegments = arr.slice(0, i + 1);
			const url = '/' + urlSegments.join('/');
			return {
				display: displayEntry,
				url: url
			};
		});
</script>

<nav id="navbar" class="h-12">
	<a href="/" id="navbar__branding__link">
		<img src="/favicon.png" alt="icon" height="auto" style="width: 30px;" />
		<button data-testid="navbarBrandingTitle">Pokécompanion</button>
	</a>

	<div class="navbar__links">
		<div style="display: grid;">
			<button id="navbar__hamburger" on:click={toggleMobileNavExtended}>
				<img
					src={`${isMobileMenuExpanded ? '/bag_open.png' : '/bag_closed.png'}`}
					alt={`${isMobileMenuExpanded ? 'Open bag' : 'Closed bag'}`}
				/>
			</button>
		</div>

		<a href="/pokemon" class="navbar__button hidden--mobile" on:click={toggleMobileNavExtended}>
			<button>Pokémon</button>
		</a>

		<a href="/settings" class="navbar__button hidden--mobile" on:click={toggleMobileNavExtended}>
			<button>Settings</button>
		</a>

		<a href="/user" class="navbar__button hidden--mobile" on:click={toggleMobileNavExtended}>
			<button>User</button>
		</a>

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
	{#if $notifications.filter((a) => a.visible).length > 0}
		<div class="columns">
			{#each $notifications as notification}
				<button
					class={`column ${notification.level}`}
					on:click={() => {
						notification.visible = false;
					}}
				>
					{notification.message}
				</button>
			{/each}
		</div>
	{/if}

	{#if breadcrumbs.length > 1 && $page.status === 200}
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

	<slot />

	<img src="/offline.png" class="hidden" alt="offline placeholder" />
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
