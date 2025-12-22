<script lang="ts">
	import Icon from '$/ui/atoms/Icon.svelte';
	import { capitaliseEachWord } from '$/lib/utils/string';
	import Button from '$/ui/atoms/Button.svelte';
	import ExpandableButton from '$/lib/components/ExpandableButton.svelte';
	import type { APIPokemon } from '$/@types/api.pokecompanion';
	import type { paths } from '$/@types/api';

	type APIAbility =
		paths['/ability/{id}']['get']['responses']['200']['content']['application/json'];

	interface Props {
		abilities: Array<
			APIPokemon['abilities'][number] & {
				data: Promise<APIAbility>;
			}
		>;
	}

	let { abilities }: Props = $props();

	function findStaticAbility(fullAbility: APIAbility) {
		const staticAbility = abilities.find((ability) => ability.id === fullAbility.id);
		if (!staticAbility) {
			throw new Error('Could not find a matching static ability from the same data set');
		}

		return {
			...staticAbility,
			...fullAbility
		};
	}
</script>

<div class={`grid gap-4`}>
	{#await Promise.all(abilities.map((ability) => ability.data))}
		{#each abilities as pendingAbility}
			<Button
				classes="w-full text-center min-w-max"
				style="height: 3rem;"
				variant="primary"
				isDisabled
				isNested
				data-umami-event="PokemonAbility"
			>
				{#if pendingAbility.is_hidden}
					<Icon
						name="hidden"
						style="margin-top: auto; margin-bottom: auto; margin-right: 0.5rem;"
					/>
				{/if}

				{capitaliseEachWord(pendingAbility.ability.name).replaceAll('-', ' ')}
			</Button>
		{/each}
	{:then fullAbilities}
		{#each fullAbilities as fullAbility}
			<ExpandableButton data-umami-event="PokemonAbility">
				{#snippet title()}
					<div class="inline-flex">
						{#if findStaticAbility(fullAbility).is_hidden}
							<Icon
								name="hidden"
								style="margin-top: auto; margin-bottom: auto; margin-right: 0.5rem;"
							/>
						{/if}

						{fullAbility.name}
					</div>
				{/snippet}
				{#snippet content()}
					<div>
						{#each fullAbility.effectEntries as effect}
							<p>{effect.shortEffect}</p>
						{/each}
						<a href={fullAbility.slug} class="inline-flex"
							>Learn more <Icon
								name="link"
								style="margin-top: auto; margin-bottom: auto; margin-left: 0.5rem;"
							/></a
						>
					</div>
				{/snippet}
			</ExpandableButton>
		{/each}
	{:catch}
		{#each abilities as ability}
			<Button
				classes="w-full text-center min-w-max"
				variant="primary"
				isDisabled
				isNested
				data-umami-event="PokemonAbility"
			>
				{#if ability.is_hidden}
					<Icon
						name="hidden"
						style="margin-top: auto; margin-bottom: auto; margin-right: 0.5rem;"
					/>
				{/if}

				{capitaliseEachWord(ability.ability.name).replaceAll('-', ' ')}
			</Button>
			<p>Failed to get more info about this ability</p>
		{/each}
	{/await}
</div>
