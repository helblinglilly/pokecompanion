<script lang="ts">
	import { GameGroups, getGameGroupFromName } from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';

	let selectedGameGroup: any;

	$: selectedGameGroup = $selectedGame ? $selectedGame.pokeapi : 'generic';
</script>

<div>
	<label for="gameSelector"><h3 class="h3">Select Game</h3></label>
	<select
		name="gameSelector"
		id="gameSelector"
		on:change={(event) => {
			if (event.target) {
				// @ts-ignore Value will exist, but type does not know this
				const gameValue = getGameGroupFromName(event.target.value);
				selectedGame.set(gameValue);
			}
		}}
	>
		<option
			value={'generic'}
			class={$selectedGame === undefined ? 'selected' : undefined}
			selected={$selectedGame === undefined}>Generic</option
		>
		{#each GameGroups as gameGroup}
			<option
				value={gameGroup.pokeapi}
				class={gameGroup.pokeapi === $selectedGame?.pokeapi ? 'selected' : undefined}
				selected={gameGroup.pokeapi === $selectedGame?.pokeapi}
			>
				<p>{gameGroup.shortName}</p>
			</option>
		{/each}
	</select>
</div>
