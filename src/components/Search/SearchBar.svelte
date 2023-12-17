<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const placeholders = ['All sorts', 'Pokémon', 'Pokédex ID', 'Items', 'Moves', 'Abilities'];
	let id = Math.floor(Math.random() * (placeholders.length - 1 - 1 + 1)) + 1;

	let searchTerm: string | undefined;
	const onSubmit = (e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
		if (!searchTerm) {
			e.preventDefault();
			return;
		}
		if (searchTerm) {
			e.preventDefault();
			const newUrl = new URL($page.url);
			newUrl.searchParams.set('term', searchTerm);
			newUrl.pathname = 'search';
			goto(newUrl);
		}
	};
</script>

<div id="searchFormWrapper">
	<form id="searchForm" on:submit={onSubmit}>
		<input
			type="text"
			style="width: 100%"
			placeholder={`${placeholders[id]}...`}
			bind:value={searchTerm}
		/>
		<button class="button" type="submit">Search</button>
	</form>
</div>

<style>
	#searchFormWrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	#searchForm {
		display: inline-flex;
		padding-bottom: 2rem;
		width: 50%;
	}

	button {
		min-width: fit-content;
		text-align: center;
		padding: 1rem;
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

		button {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}

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
