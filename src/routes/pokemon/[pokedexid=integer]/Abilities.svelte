<script lang="ts">
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import { capitaliseEachWord } from '$/lib/utils/string';
	import type { AbilityResponse } from '$/routes/api/ability/[id=integer]/types';
	import Button from '$/ui/atoms/button/Button.svelte';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import type { Ability } from '$lib/types/IPokemon';
	import { getNameEntry } from '$lib/utils/language';
	import ExpandableButton from '$/lib/components/ExpandableButton.svelte';

	export let abilities: Ability[];

	async function getAbilityData() {
		const responses = await Promise.all(
			abilities.map((ability) => fetch(`/api/ability/${ability.ability.url.split('/')[6]}`))
		);
		const bodies = (await Promise.all(responses.map((res) => res.json()))) as AbilityResponse[];

		return bodies
			.map((ability) => ({
				name: getNameEntry(ability.names, $primaryLanguage),
				is_hidden: abilities.find((monAbility) => monAbility.ability.name === ability.name)
					?.is_hidden,
				effect_entries: ability.effect_entries
					.filter((entry) => [$primaryLanguage, $secondaryLanguage].includes(entry.language.name))
					.map((entry) => entry.short_effect) ?? ['Missing data'],
				id: ability.id
			}))
			.sort((a, b) =>
				(abilities.find((ability) => ability.ability.name === a.name)?.slot ?? -1) >
				(abilities.find((ability) => ability.ability.name === b.name)?.slot ?? -1)
					? 1
					: -1
			);
	}
</script>

<div class={`grid gap-4`}>
	{#await getAbilityData()}
		{#each abilities as staticAbility}
			<Button classes="w-full text-center min-w-max" variant="primary" isNested>
				{#if staticAbility.is_hidden}
					<Icon
						name="hidden"
						style="margin-top: auto; margin-bottom: auto; margin-right: 0.5rem;"
					/>
				{/if}

				{capitaliseEachWord(staticAbility.ability.name).replaceAll('-', ' ')}
			</Button>
		{/each}
	{:then data}
		{#each data as ability}
			<ExpandableButton>
				<div slot="title" class="inline-flex">
					{#if ability.is_hidden}
						<Icon
							name="hidden"
							style="margin-top: auto; margin-bottom: auto; margin-right: 0.5rem;"
						/>
					{/if}

					{ability.name}
				</div>
				<div slot="content">
					{#each ability.effect_entries as effect}
						<p>{effect}</p>
					{/each}
					<a href={`/ability/${ability.id}`} class="inline-flex"
						>Learn more <Icon
							name="link"
							style="margin-top: auto; margin-bottom: auto; margin-left: 0.5rem;"
						/></a
					>
				</div>
			</ExpandableButton>
		{/each}
	{:catch}
		{#each abilities as staticAbility}
			<Button classes="w-full text-center min-w-max" isDisabled variant="primary" isNested>
				{#if staticAbility.is_hidden}
					<Icon
						name="hidden"
						style="margin-top: auto; margin-bottom: auto; margin-right: 0.5rem;"
					/>
				{/if}

				{capitaliseEachWord(staticAbility.ability.name).replaceAll('-', ' ')}
			</Button>
		{/each}
	{/await}
</div>
