<script lang="ts">
	import formatEvolutions, { type IEvolution } from '$lib/pokemon-id/evolution';
	import type { IAPIEvolution } from '$lib/types/IEvolution';
	import { capitaliseFirstLetter } from '$lib/utils/string';
	import { onMount } from 'svelte';

	export let evolutionChainUrl: string;
	export let id: number;

	$: if (evolutionChainUrl && isMounted) {
		fetchAndParse(evolutionChainUrl);
	}
	let isMounted = false;

	onMount(async () => {
		await fetchAndParse(evolutionChainUrl);
		isMounted = true;
	});

	let evolutions: IEvolution[] = [];

	const fetchAndParse = async (url: string) => {
		try {
			const response = await fetch(url);
			const body = (await response.json()) as IAPIEvolution;

			evolutions = body.chain.evolves_to
				.map((direction) => {
					const sourceId = body.chain.species.url.split('/')[6];
					return formatEvolutions(direction, Number(sourceId));
				})
				.flat();
		} catch (err) {
			console.error(`Failed to get evolution chain data`);
			return [];
		}
	};
</script>

{#if evolutions.length === 0}
	<p>This Pokémon has no evolutions</p>
{/if}
{#each evolutions as evolution}
	<div class="columns mobile">
		<div class="column" style="display: grid; justify-content: center;">
			<a href={evolution.sourceURL}>
				<img src={evolution.sourceSprite} alt="test" class="sprite" />
			</a>
		</div>
		<div
			class="column"
			style="display: grid; justify-content: center; text-align: center; align-items: center;"
		>
			{#if evolution.trigger !== 'use-item'}
				<p>{evolution.trigger}</p>
			{/if}
			<!-- <p>{JSON.stringify(evolution.requirements)}</p> -->
			{#each evolution.requirements as requirement}
				{#if requirement.type === 'daytime'}
					<p>At {capitaliseFirstLetter(requirement.info)}</p>
				{/if}
				{#if requirement.type === 'use-item'}
					<a href={requirement.supplementary} style="width: 100%; display: inline-flex;">
						<p>Use</p>
						<img src={requirement.info} alt={requirement.supplementary} />
					</a>
				{/if}
				{#if requirement.type === 'friendship'}
					<p>Friendship</p>
				{/if}
			{/each}
		</div>
		<div class="column" style="display: grid; justify-content: center;">
			<a href={evolution.targetURL}>
				<img src={evolution.targetSprite} alt="test" class="sprite" />
			</a>
		</div>
	</div>
{/each}
