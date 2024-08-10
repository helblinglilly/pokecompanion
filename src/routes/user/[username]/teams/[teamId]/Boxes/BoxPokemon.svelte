<script lang="ts">
	import type { IBasePokemon, ITeam } from '$/lib/types/ITeams';
	import PokemonEditor from '../PokemonEditor.svelte';
	import { getContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { getGameGroupFromGame, getGameFromName, type IGame } from '$/lib/data/games';
	import BoxSprite from './BoxSprite.svelte';

	let isEditorOpen = writable(false);
	export let inModifyView = false;

	const team = getContext('teamView') as Writable<ITeam>;
	const gameGroup = getGameGroupFromGame(
		getGameFromName($team.game) as unknown as IGame | undefined
	);

	export let pokemon: IBasePokemon;
</script>

<button
	class="h-20 w-20 rounded-full grid align-center"
	style="background-color: var(--card-background-light);"
	on:click={() => {
		if (inModifyView) {
			isEditorOpen.set(true);
		}
	}}
>
	<BoxSprite
		id={pokemon.national_dex}
		{inModifyView}
		game={gameGroup}
		onViewClick={() => {
			console.log('read only more pokemon info');
		}}
		onEditClick={() => {
			console.log('edit pokemon');
		}}
	/>
</button>

<PokemonEditor
	showOverlay={isEditorOpen}
	initialPokemon={pokemon}
	onSaveClick={async (pokemon) => {
		console.log('done editing an existing pokemon');
	}}
/>
