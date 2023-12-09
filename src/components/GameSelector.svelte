<script lang="ts">
	import { findGameFromString, gameGroups } from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';

	let selectedGameGroup: any;

	$: selectedGameGroup = $selectedGame ? $selectedGame.cookieGroup : 'generic';
</script>

<div>
	<label for="gameSelector"><h3>Select Game</h3></label>
	<select
		bind:value={selectedGameGroup}
		on:change={(event) => {
			if (event.currentTarget.value) {
				const gameValue = findGameFromString(event.currentTarget.value);
				selectedGame.set(gameValue);
			}
		}}
		name="gameSelector"
		id="gameSelector"
	>
		<option
			value={'generic'}
			class={$selectedGame === undefined ? 'selected' : undefined}
			selected={$selectedGame === undefined}>Generic</option
		>
		{#each gameGroups as gameGroup}
			<option
				value={gameGroup[0].cookieGroup}
				class={gameGroup[0].cookieGroup === $selectedGame?.cookieGroup ? 'selected' : undefined}
				selected={gameGroup[0].cookieGroup === $selectedGame?.cookieGroup}
			>
				{#each gameGroup as game, i}
					{game.shortName}
					{#if i < gameGroup.length - 1}
						<p>{` / `}</p>
					{/if}
				{/each}
			</option>
		{/each}
	</select>
</div>
