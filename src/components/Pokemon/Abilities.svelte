<script lang="ts">
	import Icon from '$components/UI/Icon.svelte';
	import { Logger } from '$lib/log';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import type { Ability, ApiAbility } from '$lib/types/IPokemon';
	import { dropFalsey, uniques } from '$lib/utils/array';
	import { getNameEntry } from '$lib/utils/language';
	import { debounce } from 'lodash-es';
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

	const fetchData = debounce(async () => {
		const allRequests = await Promise.all(
			abilities.map((ability) => {
				return fetch(ability.ability.url);
			})
		).catch(async (err) => {
			await Logger.warn('Failed to fetch abilities', {
				context: 'When initialising a Pokemons Ability, one or more request failed',
				error: Logger.buildError(err)
			});
			return [];
		});

		const apiAbilities = (await Promise.all(allRequests.map((res) => res.json())).catch(
			async (err) => {
				await Logger.warn('Failed to process abilities', {
					context: 'When initialising a Pokemons Ability, parsing one or more ability has failed',
					error: Logger.buildError(err)
				});
				return [];
			}
		)) as unknown as ApiAbility[];

		data = abilities.map((ability) => {
			const apiAbility = apiAbilities.find((a) => a.name === ability.ability.name);

			const lang1 = getNameEntry(apiAbility?.names || [], $primaryLanguage);
			const lang2 = getNameEntry(apiAbility?.names || [], $secondaryLanguage ?? 'none');

			const effect1 =
				apiAbility?.effect_entries.find((entry) => entry.language.name === $primaryLanguage)
					?.short_effect ??
				apiAbility?.flavor_text_entries.find((entry) => entry.language.name === $primaryLanguage)
					?.flavor_text ??
				'No data';

			const effect2 =
				apiAbility?.effect_entries.find((entry) => entry.language.name === $secondaryLanguage)
					?.short_effect ??
				apiAbility?.flavor_text_entries.find((entry) => entry.language.name === $secondaryLanguage)
					?.flavor_text ??
				'No data';

			return {
				id: apiAbility?.id || 0,
				names: dropFalsey(uniques([lang1, lang2])),
				slot: ability.slot,
				is_hidden: ability.is_hidden,
				effect1,
				effect2
			};
		});
	}, 1000);

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
	{#if data.length === 0}
		<p>Loading...</p>
	{/if}

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
						window?.newrelic?.addPageAction('UIInteraction', {
							field: 'Ability',
							action: 'Collapse'
						});
					} else {
						selectedAbility = i;
						window?.newrelic?.addPageAction('UIInteraction', {
							field: 'Ability',
							action: 'Expand'
						});
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
