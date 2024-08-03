<script lang="ts">
	import SocialPreview from '$/components/SocialPreview.svelte';
	import Breadcrumbs from '$/components/UI/Breadcrumbs.svelte';
	import { getGameFromName } from '$/lib/data/games';
	import { addNotification } from '$/lib/stores/notifications.js';
	import { currentUser } from '$/lib/stores/user';
	import Button from '$/ui/atoms/button/Button.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Header from '$/ui/molecules/Collections/Header/Header.svelte';
	import { getContext, setContext } from 'svelte';
	import AddPokemonToBoxes from './Boxes/AddPokemonToBoxes.svelte';
	import TeamEditor from './TeamEditor.svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { ITeam } from '$/lib/types/ITeams';
	import Sprite from '$/ui/atoms/pokemon/party/sprite/Sprite.svelte';

	export let data;

	let inModifyView = false;

	setContext('teamView', writable(data.team));
	const team = getContext('teamView') as Writable<ITeam>;
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
		{#each $team.party.sort((a, b) => (a.position < b.position ? 1 : -1)) as pokemon}
			<Sprite
				id={pokemon.national_dex}
				link={`/pokemon/${pokemon.national_dex}`}
				inEditMode={inModifyView}
				onEditClick={(initiator) => {
					console.log(initiator);
				}}
			/>
		{/each}
	</Card>

	<h2 class="h2">In boxes</h2>

	<Card classes="mb-4">
		<div class="mb-4">
			<AddPokemonToBoxes teamId={$team.id} game={data.team.game} />
		</div>

		{#if $team.bench.length === 0}
			<p>You have no Pokemon in your boxes</p>
		{/if}
		{#each $team.bench as pokemon}
			<p>{pokemon.nickname} {pokemon.national_dex}</p>
		{/each}
	</Card>
</div>
