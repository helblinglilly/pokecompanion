<script lang="ts">
	import { getGame, type PokeapiVersionNames } from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';

	export let versions: PokeapiVersionNames[];
	export let currentlySelected: PokeapiVersionNames | 'generic' | undefined;
	export let onChange: (_a: PokeapiVersionNames | 'generic') => any;
	export let isVisibleOnEmptyOptions: boolean = false;

	$: games = versions.map((version) => getGame(version)).filter((a) => a);

	const convertType = (
		event: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		}
	): PokeapiVersionNames | 'generic' | undefined => {
		let eventTarget = event.target as HTMLInputElement;
		if (eventTarget?.value) {
			return eventTarget.value as PokeapiVersionNames | 'generic';
		}
	};
</script>

{#if versions.length > 0 || isVisibleOnEmptyOptions}
	<select
		on:change={(event) => {
			const newValue = convertType(event);
			if (newValue) {
				onChange(newValue);
			}
		}}
	>
		{#if !$selectedGame?.games.some( (selectedGame) => games.some((game) => selectedGame.pokeapi === game?.pokeapi) )}
			<option value={'generic'}> - </option>
		{:else if !games.some((game) => game?.pokeapi === currentlySelected)}
			<option value={currentlySelected}> - </option>
		{/if}

		{#each games as game}
			{#if game}
				<option value={game.pokeapi} selected={currentlySelected === game.pokeapi}>
					{game.shortName}
				</option>
			{/if}
		{/each}
	</select>
{/if}
