<script lang="ts">
	import { findGameFromString, gameGroups } from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';

	let selectedGameGroup: any;

	$: selectedGameGroup = $selectedGame ? $selectedGame.cookieGroup : 'generic';
</script>

<div>
	<label for="gameSelector"><h3 class="h3">Select Game</h3></label>
	<select
		name="gameSelector"
		id="gameSelector"
		on:change={(event) => {
			if (event.target) {
				// @ts-ignore Value will exist, but type does not know this
				const gameValue = findGameFromString(event.target.value);
				selectedGame.set(gameValue);
			}
		}}
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
