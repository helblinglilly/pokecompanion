<script lang="ts">
	import SocialPreview from '$/components/SocialPreview.svelte';
	import Breadcrumbs from '$/components/UI/Breadcrumbs.svelte';
	import {
		getGameFromName,
		getGameGroupFromGame,
		getPokemonEntry,
		type IGame
	} from '$/lib/data/games';
	import { addNotification } from '$/lib/stores/notifications.js';
	import { currentUser } from '$/lib/stores/user';
	import Button from '$/ui/atoms/button/Button.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Header from '$/ui/molecules/Collections/Header/Header.svelte';
	import { getContext, setContext } from 'svelte';
	import PokemonEditor from './PokemonEditor.svelte';
	import TeamEditor from './TeamEditor.svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { IBasePokemon, ITeam } from '$/lib/types/ITeams';
	import PartySprite from '$/ui/atoms/pokemon/party/sprite/Sprite.svelte';
	import { primaryLanguage } from '$/lib/stores/domain';
	import { getLanguageEntry } from '$/lib/utils/language';
	import BoxPokemon from './Boxes/BoxPokemon.svelte';

	export let data;

	let inModifyView = false;

	let isNewPokemonOverlayOpen = writable(false);
	const newPokemon: Writable<IBasePokemon> = writable({
		national_dex: -1,
		nickname: undefined,
		variety: undefined,
		gender: 'unknown',
		shiny: false,
		ability: 0,
		move1: 0,
		move2: 0,
		move3: 0,
		move4: 0
	});

	setContext('teamView', writable(data.team));
	const team = getContext('teamView') as Writable<ITeam>;

	const gameGroup = getGameGroupFromGame(
		getGameFromName(data.team.game) as unknown as IGame | undefined
	);
</script>

<SocialPreview
	title={`${data.team.name} - tag`}
	description={`${data.team.name} created by ${data.user.username}${
		data.team.description ? ` - ${data.team.description}` : ''
	}`}
/>

<Breadcrumbs
	breadcrumbs={[
		{
			display: data.user.username,
			url: `/user/${data.user.username}`
		},
		{
			display: data.team.name
		}
	]}
/>

<div class="grid gap-4 pb-4">
	<Header
		entry={{
			...$team,
			description: $team.description.length > 0 ? $team.description : 'No description'
		}}
		bind:inModifyView
	/>

	{#if $currentUser?.id === $team.owner}
		<div class="w-full justify-center md:w-fit grid md:inline-flex gap-2 items-center">
			<Button
				on:click={async () => {
					const res = await fetch('/api/teams/activity', {
						method: 'PATCH',
						body: JSON.stringify({
							id: $team.id,
							active: !$team.isActiveForGame
						})
					});

					if (res.ok) {
						addNotification({
							level: 'success',
							message: $team.isActiveForGame
								? 'This team will no longer overlay when browsing the site'
								: 'This team will now overlay when browsing with this game selected'
						});
						$team.isActiveForGame = !$team.isActiveForGame;
					} else {
						addNotification({
							level: 'failure',
							message: 'Something went wrong - please try again'
						});
					}
				}}
			>
				{$team.isActiveForGame ? '🟢' : '🔴'}
				{$team.isActiveForGame ? 'Deactivate' : 'Activate'} for {getGameFromName($team.game)
					.shortName}
			</Button>

			{#if inModifyView}
				<TeamEditor {team} />
			{/if}
		</div>
	{/if}
</div>

<div class="grid gap-4">
	<h2 class="h2">Active Party</h2>
	<Card
		classes="w-full justify-around grid grid-cols-2 md:grid-cols-6 grid-flow-row gap-8 md:gap-4 justify-items-center"
		style="background-color: var(--red-accent); padding-top: 2rem; padding-bottom: 2rem;"
	>
		{#each $team.party.sort((a, b) => (a.position < b.position ? -1 : 1)) as pokemon, partySlot}
			<PartySprite
				{partySlot}
				id={pokemon.national_dex}
				inEditMode={inModifyView}
				game={gameGroup}
				onViewClick={() => {
					console.log('read only more pokemon info');
				}}
				onEditClick={() => {
					// console.log('select different pokemon into slot');
				}}
			/>
		{/each}
	</Card>

	<h2 class="h2">In boxes</h2>

	<Card classes="mb-4 max-h-fit" isActive>
		<div class="mb-4">
			<Button
				classes="h-2 text-sm min-h-[4rem] md:min-h-fit"
				variant="accent"
				on:click={() => {
					isNewPokemonOverlayOpen.set(true);
				}}
			>
				Add Pokémon
			</Button>
		</div>

		{#if $team.bench.length === 0}
			<p>You have no Pokemon in your boxes</p>
		{/if}

		<div class="flex flex-wrap gap-8 mx-4">
			{#each $team.bench.sort( (a, b) => (new Date(a.updated) < new Date(b.updated) ? -1 : 1) ) as pokemon}
				<BoxPokemon pokemon={writable(pokemon)} {inModifyView} />
			{/each}
		</div>
	</Card>
</div>

<PokemonEditor
	showOverlay={isNewPokemonOverlayOpen}
	pokemon={newPokemon}
	onSaveClick={async () => {
		const res = await fetch(`/api/teams/${$team.id}/pokemon`, {
			method: 'POST',
			body: JSON.stringify({
				pokemon: {
					...$newPokemon
				}
			})
		});
		if (!res.ok) {
			addNotification({
				level: 'failure',
				message: `Failed to add ${
					$newPokemon.nickname ??
					getLanguageEntry(getPokemonEntry($newPokemon.national_dex).names, $primaryLanguage)
				} - Please try again`
			});
		} else {
			$team.bench = [
				...$team.bench,
				{
					...$newPokemon,
					team: $team.id,
					owner: $team.owner,
					position: 6,
					id: ''
				}
			];
		}
	}}
/>
