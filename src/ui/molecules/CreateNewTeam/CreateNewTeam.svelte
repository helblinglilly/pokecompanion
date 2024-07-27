<script lang="ts">
	import InlineTextButton from '$/components/InlineTextButton.svelte';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import Button from '$/ui/atoms/button/Button.svelte';
	import Select from '$/ui/atoms/select/Select.svelte';
	import { GameGroups, PokeapiVersionNames } from '$/lib/data/games';
	import { selectedGame } from '$/lib/stores/domain';
	import { addNotification } from '$/lib/stores/notifications';

	let showAddNewOverlay: boolean;
	let isPrivate: boolean;
	let newTeamName: string;
	let game: PokeapiVersionNames = $selectedGame
		? $selectedGame.games[0].pokeapi
		: GameGroups[GameGroups.length - 1].games[0].pokeapi;
</script>

<Button
	classes="h-2 text-sm min-h-[4rem] md:min-h-fit"
	variant="accent"
	on:click={() => {
		showAddNewOverlay = true;
	}}
>
	New Team
</Button>

<Modal bind:showModal={showAddNewOverlay}>
	<h2 class="h2" slot="header">Create new team</h2>

	<form>
		<div id="newTeamName">
			<InlineTextButton
				bind:valueBinding={newTeamName}
				variation="small"
				buttonConfig={{
					text: 'Create',
					onClick: async () => {
						const response = await fetch('/api/teams', {
							method: 'POST',
							body: JSON.stringify({
								name: newTeamName,
								description: '',
								game,
								isPrivate
							})
						});

						if (!response.ok) {
							addNotification({
								level: 'failure',
								message: 'Failed to create new team - please try again'
							});
						} else {
							addNotification({
								level: 'success',
								message: 'Created new team'
							});
						}

						showAddNewOverlay = false;
					}
				}}
				inputConfig={{ placeholder: 'Team name' }}
				containerStyling="width: 70%;"
			/>
		</div>
		<div class="grid">
			<p>The game in which this team exists</p>
			<div>
				<Select
					options={GameGroups.map((gameGroup) => {
						return gameGroup.games.map((game) => {
							return {
								label: game.shortName,
								value: game.pokeapi
							};
						});
					}).flat()}
					bind:value={game}
				/>
			</div>
		</div>
		<div>
			<input
				type="checkbox"
				id="isPrivate"
				on:change={(e) => {
					isPrivate = e.currentTarget.checked;
				}}
			/>
			<label style="padding-left: 0.5rem;" for="isPrivate">Private Team</label>
		</div>
	</form>
</Modal>

<style>
	form > div {
		display: inline-flex;
		height: 100%;
		width: 100%;
		padding-top: 1rem;
		justify-content: center;
	}
</style>
