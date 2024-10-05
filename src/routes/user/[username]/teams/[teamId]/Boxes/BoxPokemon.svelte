<script lang="ts">
	import type { ITeam, ITeamPokemon } from '$/lib/types/ITeams';
	import PokemonEditor from '../PokemonEditor.svelte';
	import { getContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import {
		getGameGroupFromGame,
		getGameFromName,
		type IGame,
		getPokemonEntry
	} from '$/lib/data/games';
	import BoxSprite from './BoxSprite.svelte';
	import { addNotification } from '$/lib/stores/notifications';
	import { primaryLanguage } from '$/lib/stores/domain';
	import { getLanguageEntry } from '$/lib/utils/language';

	let isEditorOpen = writable(false);
	export let inModifyView = false;

	const team = getContext('teamView') as Writable<ITeam>;
	const gameGroup = getGameGroupFromGame(
		getGameFromName($team.game) as unknown as IGame | undefined
	);

	export let pokemon: Writable<ITeamPokemon>;
</script>

<button
	class="h-20 w-20 rounded-full grid align-center justify-start"
	style="background-color: var(--card-background-light);"
	on:click={() => {
		if (inModifyView) {
			isEditorOpen.set(true);
		}
	}}
>
	<BoxSprite
		id={$pokemon.national_dex}
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
	existingPokemon={$pokemon}
	on:save={async ({ detail }) => {
		const res = await fetch(`/api/teams/${$team.id}/pokemon/${$pokemon.id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				pokemon: { ...detail }
			})
		});

		if (!res.ok) {
			addNotification({
				level: 'failure',
				message: `Failed to edit ${
					detail.nickname ??
					getLanguageEntry(getPokemonEntry(detail.national_dex).names, $primaryLanguage)
				} - Please try again`
			});
		} else {
			isEditorOpen.set(false);
			pokemon.set({
				...$pokemon,
				...detail
			});
		}
	}}
>
	<h2 class="h2" slot="title">Edit {$pokemon.nickname ?? ''}</h2>
</PokemonEditor>
