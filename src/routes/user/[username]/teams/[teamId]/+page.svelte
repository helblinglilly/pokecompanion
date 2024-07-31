<script lang="ts">
	import SocialPreview from '$/components/SocialPreview.svelte';
	import Breadcrumbs from '$/components/UI/Breadcrumbs.svelte';
	import { getGameFromName } from '$/lib/data/games';
	import { addNotification } from '$/lib/stores/notifications.js';
	import { currentUser } from '$/lib/stores/user';
	import Button from '$/ui/atoms/button/Button.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Sprite from '$/ui/atoms/pokemon/party/sprite/Sprite.svelte';
	import Header from '$/ui/molecules/Collections/Header/Header.svelte';

	export let data;
	let inModifyView = false;
</script>

<SocialPreview
	title={`${data.teamData.name} - tag`}
	description={`${data.teamData.name} created by ${data.user.username}${
		data.teamData.description ? ` - ${data.teamData.description}` : ''
	}`}
/>

<Breadcrumbs
	breadcrumbs={[
		{
			display: data.user.username,
			url: `/user/${data.user.username}`
		},
		{
			display: data.teamData.name
		}
	]}
/>

<div class="grid gap-4 pb-4">
	<Header entry={data.teamData} bind:inModifyView />

	<div>
		{#if $currentUser?.id === data.teamData.owner}
			{#if data.teamData.isActiveForGame}
				<Button
					on:click={async () => {
						const res = await fetch('/api/teams/activity', {
							method: 'PATCH',
							body: JSON.stringify({
								id: data.teamData.id,
								active: false
							})
						});
						if (res.ok) {
							addNotification({
								level: 'success',
								message: 'This team will no longer overlay when browsing the site'
							});
						} else {
							addNotification({
								level: 'failure',
								message: 'Something went wrong - please try again'
							});
						}
					}}
				>
					Deactivate for {getGameFromName(data.teamData.game).shortName}
				</Button>
			{:else}
				<Button
					on:click={async () => {
						const res = await fetch('/api/teams/activity', {
							method: 'PATCH',
							body: JSON.stringify({
								id: data.teamData.id,
								active: true
							})
						});
						if (res.ok) {
							addNotification({
								level: 'success',
								message: `This team will now be shown in overlays when browsing for ${
									getGameFromName(data.teamData.game).shortName
								}`
							});
						} else {
							addNotification({
								level: 'failure',
								message: 'Something went wrong - please try again'
							});
						}
					}}
				>
					Activate for {getGameFromName(data.teamData.game).shortName}
				</Button>
			{/if}
		{/if}
	</div>
</div>

<div class="grid gap-4">
	<h2 class="h2">Active Party</h2>
	<Card
		classes="w-full justify-around grid grid-cols-2 md:grid-cols-6 grid-flow-row gap-4 justify-items-center"
		style="background-color: var(--red-accent);"
	>
		{#each data.teamData.contents.party as pokemon}
			<Sprite
				id={pokemon.id}
				link={`/pokemon/${pokemon.id}`}
				inEditMode={inModifyView}
				onEditClick={(initiator) => {
					console.log(initiator);
				}}
			/>
		{/each}
	</Card>

	<h2 class="h2">In boxes</h2>

	<Card>
		<p>asdf</p>
	</Card>
</div>
