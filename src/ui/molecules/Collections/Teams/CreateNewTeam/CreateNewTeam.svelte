<script lang="ts">
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

<Modal bind:showModal={showAddNewOverlay} classes="md:w-[40rem]">
	<h2 class="h2" slot="header">Create new team</h2>

	<form
		class="grid justify-center gap-4 mb-4"
		on:submit={async () => {
			const res = await fetch('/api/teams', {
				method: 'POST',
				body: JSON.stringify({
					name: newTeamName,
					game: game,
					isPrviate: isPrivate,
					description: ''
				})
			});

			showAddNewOverlay = false;

			if (res.ok) {
				addNotification({
					level: 'success',
					message: `Created team ${newTeamName}`
				});
			} else {
				addNotification({
					level: 'failure',
					message: `Failed to create team "${newTeamName}". Please try again`
				});
			}
		}}
	>
		<div class="w-full">
			<p>Name this team</p>
			<input type="text" placeholder="Team name" bind:value={newTeamName} class="w-full" />
		</div>

		<div class="grid">
			<p>The game that this team will be tied to</p>
			<Select
				isNested
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

		<div class="flex justify-center">
			<input
				type="checkbox"
				id="isPrivate"
				class="nested"
				on:change={(e) => {
					isPrivate = e.currentTarget.checked;
				}}
			/>
			<label for="isPrivate">Private</label>
		</div>

		<div class="grid w-full">
			<Button type="submit" variant="accent">Create</Button>
		</div>
	</form>
</Modal>
