<script lang="ts">
	import Button from '$/ui/atoms/Button.svelte';
	import { searchTerm } from './searchbar';

	const placeholders = ['Pokémon names', 'Pokédex ID', 'Items', 'Moves', 'Abilities'];
	let id = $state(Math.floor(Math.random() * placeholders.length));

	$effect(() => {
		const interval = setInterval(() => {
			id = Math.floor(Math.random() * placeholders.length);
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<search>
	<form id="searchForm" action="/search" method="get" data-sveltekit-reload>
		<input
			type="text"
			style="width: 100%"
			placeholder={`${placeholders[id]}...`}
			name="term"
			bind:value={$searchTerm}
		/>
		<Button classes="p-2 rounded-l-none md:rounded-lg" type="submit" variant="accent">Search</Button
		>
	</form>
</search>

<style>
	search {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	#searchForm {
		display: inline-flex;
		padding-bottom: 2rem;
		width: 50%;
	}

	input[type='text'] {
		height: 100%;
		padding: 10px;
		padding-left: 2rem;
		padding-right: 2rem;
	}

	@media (max-width: 768px) {
		#searchForm {
			width: 100%;
		}

		/* button {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		} */

		input[type='text'] {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}

	@media (min-width: 768px) {
		#searchForm {
			gap: 10px;
		}
	}
</style>
