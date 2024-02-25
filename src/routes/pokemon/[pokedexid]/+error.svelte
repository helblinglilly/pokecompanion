<script>
	import { page } from '$app/stores';

	import Image from '$components/UI/Image.svelte';
	import { logError } from '$lib/log';
	import { onMount } from 'svelte';

	onMount(() => {
		logError('Site crashed when accessing Pokémon', 'PokemonLoadError', {
			...$page
		});
	});
</script>

{#if $page.status === 404}
	<div id="pageWrapper">
		<div id="errorHeader">
			<Image
				src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201-question.png"
				alt="Question mark Incognito"
				style="margin-left: auto; margin-right: auto;"
			/>

			<h1 class="h1">404</h1>
			<h2 class="h2">Who's that Pokémon?</h2>

			<p>Sorry, we don't recognise a Pokémon with this National Pokédex ID.</p>
		</div>

		<hr />

		<div id="errorDetails">
			<p>
				This site gets updated weekly. If a new game has just been released its Pokémon should show
				up soon!
			</p>
		</div>
	</div>
{:else}
	<div id="pageWrapper">
		<div id="errorHeader">
			<Image src="/missingno.png" alt="missigno" style="margin-left: auto; margin-right: auto;" />

			<h1 class="h1">{$page.status}</h1>
			<h2 class="h2">Something went wrong</h2>

			<p>Sorry about that.</p>
		</div>

		<hr />
		<p>{$page.error?.message}</p>
	</div>
{/if}

<style>
	#pageWrapper {
		margin: 4rem;
		margin-top: 2rem;
	}
	#errorHeader {
		display: grid;
		text-align: center;
	}
	#errorDetails {
		display: grid;
	}

	#errorDetails > p {
		text-align: center;
	}

	h1 {
		padding-top: 1rem;
		text-align: center;
		padding-bottom: 1rem;
	}

	hr {
		margin-top: 2rem;
		margin-bottom: 2rem;
		color: var(--text);
	}

	h2 {
		text-align: center;
		margin-bottom: 2rem;
	}
</style>
