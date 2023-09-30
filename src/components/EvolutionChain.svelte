<script lang="ts">
	import formatEvolutions, { type IEvolution } from '$lib/pokemon-id/evolution';
	import type { IAPIEvolution } from '$lib/types/IEvolution';
	import { capitaliseFirstLetter } from '$lib/utils/string';
	import { onMount } from 'svelte';
	import Image from './Image.svelte';

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
				<Image src={evolution.sourceSprite} alt="test" classNames="sprite" />
			</a>
		</div>
		<div
			class="column"
			style="display: grid; justify-content: center; text-align: center; align-items: center;"
		>
			{#if evolution.trigger !== 'use-item'}
				{#if evolution.trigger === 'strong-style-move'}
					<p>Use in strong style</p>
				{:else if evolution.trigger === 'agile-style-move'}
					<p>Use in agile style</p>
				{:else}
					<p>{evolution.trigger[0].toUpperCase() + evolution.trigger.slice(1)}</p>
				{/if}
			{/if}
			<p>{JSON.stringify(evolution.requirements)}</p>
			{#each evolution.requirements as requirement}
				{#if requirement.type === 'use-item'}
					<a
						href={requirement.supplementary}
						style="width: 100%; display: inline-flex; justify-content: center;"
					>
						<p>Use</p>
						<Image
							src={requirement.info}
							height="30"
							width="30"
							alt={requirement.supplementary ?? ''}
						/>
					</a>
				{/if}

				{#if requirement.type === 'hold-item'}
					<a
						href={requirement.supplementary}
						style="width: 100%; display: inline-flex; justify-content: center;"
					>
						<p>Hold</p>
						<Image
							src={requirement.info}
							height="30"
							width="30"
							alt={requirement.supplementary ?? ''}
						/>
					</a>
				{/if}

				{#if requirement.type === 'level-up' && requirement.info}
					<p>{requirement.info}</p>
				{/if}

				{#if requirement.type === 'daytime'}
					<p>At {capitaliseFirstLetter(requirement.info)}</p>
				{/if}

				{#if requirement.type === 'stats'}
					<p>Stats: {requirement.info}</p>
				{/if}

				{#if requirement.type === 'friendship'}
					<p>Friendship</p>
				{/if}

				{#if requirement.type === 'party_have'}
					<a href={requirement.supplementary}>Have {requirement.info} in party</a>
				{/if}

				{#if requirement.type === 'know_move'}
					<a href={requirement.info}>Knows {requirement.supplementary}</a>
				{/if}

				{#if requirement.type === 'gender'}
					<p>{requirement.info}</p>
				{/if}

				{#if requirement.type === 'location'}
					<!-- Nosepass, Eeveelutions have game-specific locations -->
					<!-- Magneton evolves at locations and then with stone -->
					<p>At {requirement.info}</p>
				{/if}

				{#if requirement.type === 'beauty'}
					<!-- Look at Feebas and if you could always evolve it by trading -->
					<p>Beauty</p>
				{/if}

				{#if requirement.type === 'shed'}
					<p>{requirement.info}</p>
				{/if}

				{#if requirement.type === 'other'}
					<p>{requirement.info}</p>
				{/if}
			{/each}
		</div>
		<div class="column" style="display: grid; justify-content: center;">
			<a href={evolution.targetURL}>
				<Image src={evolution.targetSprite} alt="test" classNames="sprite" />
			</a>
		</div>
	</div>
{/each}
