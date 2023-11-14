<script lang="ts">
	import { gameGroups, getGroupName } from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';
</script>

<div>
	<label for="gameSelector"><h3>Select Game</h3></label>
	<select
		bind:value={$selectedGame}
		on:change={(event) => {
			if (event.currentTarget.value) {
				selectedGame.set(event.currentTarget.value);
			}
		}}
		name="gameSelector"
		id="gameSelector"
	>
		<option value={'generic'} class={$selectedGame === 'generic' ? 'selected' : undefined}
			>Generic</option
		>
		{#each gameGroups as gameGroup}
			<option
				value={getGroupName(gameGroup, '-', true, true, true)}
				class={getGroupName(gameGroup, '-', true, true, true) === $selectedGame
					? 'selected'
					: undefined}
			>
				{getGroupName(gameGroup, ' / ')}
			</option>
		{/each}
	</select>
</div>
