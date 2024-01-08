<script lang="ts">
	import Icon from '$components/Icon.svelte';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import type { Ability, ApiAbility } from '$lib/types/IPokemon';
	import { dropFalsey, uniques } from '$lib/utils/array';
	import { getNameEntry } from '$lib/utils/language';
	import { onMount } from 'svelte';

	export let abilities: Ability[];
	let isMounted = false;

	let data: {
		id: number;
		names: (string | undefined)[];
		slot: number;
		is_hidden: boolean;
		effect1: string;
		effect2: string | undefined;
	}[] = [];
	let selectedAbility = -1;

	const fetchData = async () => {
		const allRequests = await Promise.all(
			abilities.map((ability) => {
				return fetch(ability.ability.url);
			})
		);

		const apiAbilities = (await Promise.all(
			allRequests.map((res) => res.json())
		)) as unknown as ApiAbility[];

		data = abilities.map((ability) => {
			const apiAbility = apiAbilities.find((a) => a.name === ability.ability.name);

			const lang1 = getNameEntry(apiAbility?.names || [], $primaryLanguage);
			const lang2 = getNameEntry(apiAbility?.names || [], $secondaryLanguage ?? 'none');

			const effect1 =
				apiAbility?.effect_entries.find((entry) => {
					return entry.language.name === $primaryLanguage;
				}) || undefined;

			const effect2 =
				apiAbility?.effect_entries.find((entry) => {
					return entry.language.name === $secondaryLanguage;
				}) || undefined;

			return {
				id: apiAbility?.id || 0,
				names: dropFalsey(uniques([lang1, lang2])),
				slot: ability.slot,
				is_hidden: ability.is_hidden,
				effect1: effect1 ? effect1.short_effect : effect2 ? effect2.short_effect : 'No data',
				effect2: effect2 ? effect2.short_effect : 'No data'
			};
		});
	};

	onMount(async () => {
		await fetchData();
		isMounted = true;
	});

	$: if (isMounted && abilities) {
		data = [];
		fetchData();
	}
</script>

<div class="columns">
	{#if data.length > 0}
		{#each data as ability, i}
			<div class="column" style="display: flex; align-content: center; justify-content: center;">
				<button
					class="button secondary"
					style={`display: inline-flex; width: 100%; min-width: max-content; justify-content: center;${
						selectedAbility === i ? 'background-color: var(--selected);' : ''
					}`}
					on:click={() => {
						if (selectedAbility === i) {
							selectedAbility = -1;
						} else {
							selectedAbility = i;
						}
					}}
				>
					{#if ability.is_hidden}
						<Icon
							name="hidden"
							style="margin-top: auto; margin-bottom: auto; margin-right: 0.5rem;"
						/>
					{/if}
					<p style="margin-top: auto; margin-bottom: auto; text-align: center;">
						{ability.names[0] ?? ability.names[1] ?? 'No data'}
					</p>
				</button>
			</div>
		{/each}
	{:else}
		<p>Loading...</p>
	{/if}
</div>

{#each data as ability, i}
	<div style={selectedAbility === i ? 'display: grid;' : 'display: none;'}>
		<p>{ability.effect1}</p>
		{#if ability.effect2}
			<p style="margin-top: 1rem;">{ability.effect2}</p>
		{/if}
		{#if selectedAbility !== -1}
			<a href={`/ability/${ability.id}`} style="display: inline-flex;"
				>See more <Icon
					name="link"
					style="margin-top: auto; margin-bottom: auto; margin-left: 0.5rem;"
				/></a
			>
		{/if}
	</div>
{/each}
