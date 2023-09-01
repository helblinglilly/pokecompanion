<script lang="ts">
	import { gameGroups, getGroupName } from '$lib/data/games';
	import { selectedGame } from '$lib/domain';
</script>

<select
	bind:value={$selectedGame}
	on:change={(event) => {
		if (event.currentTarget.value) {
			selectedGame.set(event.currentTarget.value);
		}
	}}
>
	<option value={'generic'}>Generic</option>
	{#each gameGroups as gameGroup}
		<option
			value={getGroupName(gameGroup, '-', true, true, true)}
			class={getGroupName(gameGroup, '-', true, true, true) === $selectedGame ? 'selected' : ''}
		>
			{getGroupName(gameGroup, ' / ')}
		</option>
	{/each}
</select>
<p>{$selectedGame}</p>
