<script lang="ts">
	import { selectedGame } from '$/lib/stores/domain';
	import Select from '$/ui/atoms/select/Select.svelte';
	import { getGameGroupFromName, PokeapiVersionGroups, type IGameGroups } from '$lib/data/games';

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

{currentlySelected}
<Select
	options={versionGroups.map((version) => ({ label: version.shortName, value: version.pokeapi }))}
	value={currentlySelected}
	on:change={({ detail }) => {
		selectedGame.set(getGameGroupFromName(detail));
	}}
/>

<!-- {#if isVisibleOnEmptyOptions || (!isVisibleOnEmptyOptions && versionGroups.length > 0)}
	<select
		name="gameSelector"
		id="gameSelector"
		style="margin-top: 1rem; margin-bottom: 1rem; margin-right: 1rem; padding-left: 1rem; height: 50px; width: 100%;"
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
				selected={!currentlySelected || currentlySelected === 'generic'}>Generic</option
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
{/if} -->
