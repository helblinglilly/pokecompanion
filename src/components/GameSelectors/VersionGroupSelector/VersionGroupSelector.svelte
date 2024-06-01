<script lang="ts">
	import { PokeapiVersionGroups, type IGameGroups } from '$lib/data/games';

	export let versionGroups: IGameGroups[];
	export let currentlySelected: PokeapiVersionGroups | 'generic' | undefined;
	export let onChange: (_a: PokeapiVersionGroups | 'generic') => any;
	export let isVisibleOnEmptyOptions: boolean = false;
	export let showGenericOption: boolean = false;

	const convertType = (event: Event & { currentTarget: EventTarget & HTMLSelectElement }) => {
		const eventTarget = event.target as HTMLInputElement;
		if (eventTarget?.value) {
			return eventTarget.value as PokeapiVersionGroups | 'generic';
		}
	};
</script>

{#if isVisibleOnEmptyOptions || (!isVisibleOnEmptyOptions && versionGroups.length > 0)}
	<select
		name="gameSelector"
		id="gameSelector"
		class="pl-4"
		on:change={(event) => {
			const newValue = convertType(event);
			if (newValue) {
				onChange(newValue);
			}
		}}
	>
		{#if showGenericOption}
			<option
				value={'generic'}
				class={!currentlySelected || currentlySelected === 'generic' ? 'selected' : undefined}
				selected={!currentlySelected || currentlySelected === 'generic'}>-</option
			>
		{/if}

		{#each versionGroups as gameGroup}
			<option
				value={gameGroup.pokeapi}
				class={gameGroup.pokeapi === currentlySelected ? 'selected' : undefined}
				selected={gameGroup.pokeapi === currentlySelected}>{gameGroup.shortName}</option
			>
		{/each}
	</select>
{/if}
