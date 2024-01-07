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

<!-- ToDo - Hidden should be shown on the card itself - not as text -->
{#if data.length === 0}
	{#each abilities as ability, i}
		<div
			class="card"
			style={`${
				i !== abilities.length - 1 ? 'margin-bottom: 1rem;' : ''
			} min-height: 8rem; display: flex;`}
		>
			<a
				href={`/ability/${ability.ability.url.split('/')[6]}`}
				style="width: 100%; display: grid; justify-content: center; align-content: center;"
			>
				<h4>Loading...</h4>
			</a>
		</div>
	{/each}
{:else}
	{#each data as ability, i}
		<div class="card" style={`${i !== data.length - 1 ? 'margin-bottom: 1rem;' : ''}`}>
			<a href={`/ability/${ability.id}`} style={`${ability.is_hidden ? 'padding-top: 0;' : ''}`}>
				{#if ability.is_hidden}
					<div
						style="display: inline-flex; padding-top: 0.5rem; width: 100%; justify-content: end;"
					>
						<Icon
							name="hidden"
							style="margin-top: auto; margin-bottom: auto; margin-right: 0.5rem;"
						/>
						<p><i>Hidden</i></p>
					</div>
				{/if}

				<div class="combined">
					<div style="display: inline-flex; gap: 0.5rem;">
						<h4>{ability.names.length >= 2 ? ability.names.join(' - ') : ability.names[0]}</h4>
					</div>
					<p>{ability.effect1}</p>
				</div>

				<div class="columns mobile seperate">
					<div class="column">
						<div style="display: inline-flex; gap: 0.5rem;">
							<h4>{ability.names[0]}</h4>
						</div>
						<p>{ability.effect1}</p>
					</div>

					{#if ability.names.length >= 2}
						<div class="column lang2">
							<div style="display: inline-flex; gap: 0.5rem;">
								<h4>{ability.names[1]}</h4>
							</div>
							<p>{ability.effect2}</p>
						</div>
					{/if}
				</div>
			</a>
		</div>
	{/each}
{/if}

<style>
	.card {
		height: auto;
		padding: 0;
	}

	a {
		display: block;
		padding: 2rem;
		border-radius: 10px;
		text-decoration: none;
	}

	a:hover {
		background-color: var(--secondary);
	}

	@media screen and (max-width: 1200px) {
		.seperate {
			display: none;
		}
	}

	@media screen and (min-width: 1200px) {
		.combined {
			display: none;
		}
	}
</style>
