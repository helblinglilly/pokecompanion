<script lang="ts">
	import formatEvolutions, { type IEvolution } from '$lib/pokemon-id/evolution';
	import type { IAPIEvolution } from '$lib/types/IEvolution';
	import { capitaliseFirstLetter } from '$lib/utils/string';
	import { onMount } from 'svelte';
	import Image from '../UI/Image.svelte';
	import { selectedGame } from '$lib/stores/domain';
	import { Logger } from '$lib/log';
	import { getGameGroupFromName } from '$lib/data/games';

	export let evolutionChainUrl: string;

	let evolutions: IEvolution[] | undefined = undefined;
	let isMounted = false;

	onMount(() => {
		fetchData(evolutionChainUrl)
			.then(async (result) => {
				if (!result) {
					return;
				}

				evolutions = result.chain.evolves_to
					.map((direction) => {
						const sourceId = result.chain.species.url.split('/')[6];
						return formatEvolutions(
							direction,
							Number(sourceId),
							getGameGroupFromName($selectedGame?.pokeapi)
						);
					})
					.flat();
			})
			.catch(async (err) => {
				await Logger.warn('Failed to process evolution chain', {
					context: 'Client side initialisation of evolution chain',
					url: evolutionChainUrl
				});
				return [];
			})
			.finally(() => {
				isMounted = true;
			});
	});

	$: if (isMounted) {
		fetchData(evolutionChainUrl).then(async (result) => {
			if (!result) {
				return;
			}

			evolutions = result.chain.evolves_to
				.map((direction) => {
					const sourceId = result.chain.species.url.split('/')[6];
					return formatEvolutions(
						direction,
						Number(sourceId),
						getGameGroupFromName($selectedGame?.pokeapi)
					);
				})
				.flat();
		});
	}

	const fetchData = async (url: string) => {
		try {
			// ToDo: Cancel this request if a new one has been activated
			const response = await fetch(url);
			const body = await response.json();
			return body as IAPIEvolution;
		} catch (err) {
			console.error(`Failed to get evolution chain data`);
			return null;
		}
	};
</script>

{#if evolutions !== undefined}
	{#if evolutions.length === 0}
		<p style="text-align: center;">This Pokémon has no evolutions</p>
	{:else if evolutions}
		{#each evolutions as evolution}
			<div class="columns mobile">
				<div class="column" style="display: grid; justify-content: center;">
					<a
						href={evolution.sourceURL}
						on:click={() => {
							Logger.addPageAction('UIInteraction', 'EvolutionPokemon', {
								action: 'Navigation'
							});
						}}
					>
						<Image src={evolution.sourceSprite} alt={evolution.sourceSprite} classNames="sprite" />
					</a>
				</div>
				<div
					class="column"
					style="display: grid; justify-content: center; text-align: center; align-items: center;"
				>
					{#if evolution.trigger !== 'use-item'}
						{#if evolution.trigger === 'strong-style-move'}
							<p>Use specific in strong style</p>
						{:else if evolution.trigger === 'agile-style-move'}
							<p>Use specific in agile style</p>
						{:else if evolution.trigger === 'use-move'}
							<p>Use move</p>
						{:else if evolution.trigger === 'collect-items'}
							<p>Collect</p>
						{:else if evolution.trigger === 'three-critical-hits'}
							<p>Land 3 critical hits in 1 battle</p>
						{:else if evolution.trigger === 'tower-of-darkness'}
							<p>Single Strike Style in Tower of Darkness</p>
						{:else if evolution.trigger === 'tower-of-waters'}
							<p>Single Strike Style in Tower of Waters</p>
						{:else if evolution.trigger === 'walk-r'}
							<p>Walk 1000 steps in Let's Go mode</p>
						{:else}
							<p>{evolution.trigger[0].toUpperCase() + evolution.trigger.slice(1)}</p>
						{/if}
					{/if}

					{#each evolution.requirements as requirement}
						{#if requirement.type === 'use-item'}
							<a
								href={requirement.supplementary}
								style="width: 100%; display: inline-flex; justify-content: center;"
								on:click={() => {
									Logger.addPageAction('UIInteraction', 'EvolutionUseItemNavigation');
								}}
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
								on:click={() => {
									Logger.addPageAction('UIInteraction', 'EvolutionHoldItem', {
										action: 'Navigation'
									});
								}}
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
							<a
								href={requirement.supplementary}
								on:click={() => {
									Logger.addPageAction('UIInteraction', 'EvolutionPartyHave', {
										action: 'Navigation'
									});
								}}>Have {requirement.info} in party</a
							>
						{/if}

						{#if requirement.type === 'know_move'}
							<a
								href={requirement.info}
								on:click={() => {
									Logger.addPageAction('UIInteraction', 'EvolutionKnowMove', {
										action: 'Navigation'
									});
								}}>Knows {requirement.supplementary}</a
							>
						{/if}

						{#if requirement.type === 'use_move'}
							<a
								href={requirement.info}
								on:click={() => {
									Logger.addPageAction('UIInteraction', 'EvolutionUseMove', {
										action: 'Navigation'
									});
								}}>{requirement.supplementary}</a
							>
						{/if}

						{#if requirement.type === 'collect_items'}
							<a
								href={requirement.info}
								on:click={() => {
									Logger.addPageAction('UIInteraction', 'EvolutionCollectItems', {
										action: 'Navigation'
									});
								}}>{requirement.supplementary}</a
							>
						{/if}

						{#if requirement.type === 'trade_for'}
							<a
								href={requirement.supplementary}
								on:click={() => {
									Logger.addPageAction('UIInteraction', 'EvolutionTradeFor', {
										action: 'Navigation'
									});
								}}>Trade for {requirement.info}</a
							>
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

						{#if requirement.type === 'recoil-damage'}
							<p>Take {requirement.info}HP recoil damage</p>
						{/if}

						{#if requirement.type === 'other'}
							<p>{requirement.info}</p>
						{/if}

						{#if requirement.type === 'gender'}
							<p>{requirement.info}</p>
						{/if}

						{#if requirement.type === 'shed'}
							<p>{requirement.info}</p>
						{/if}

						{#if requirement.type === 'battle-leader'}
							<p>{requirement.info}</p>
						{/if}

						{#if requirement.type === 'party_type'}
							<p>{requirement.info}</p>
						{/if}

						{#if requirement.type === 'rain'}
							<p>{requirement.info}</p>
						{/if}

						{#if requirement.type === 'game-specific'}
							<p>{requirement.info}</p>
						{/if}

						{#if requirement.type === 'no-animation'}
							<p>{requirement.info}</p>
						{/if}

						{#if requirement.type === 'multiplayer'}
							<p>{requirement.info}</p>
						{/if}
					{/each}
				</div>
				<div class="column" style="display: grid; justify-content: center;">
					<a
						href={evolution.targetURL}
						on:click={() => {
							Logger.addPageAction('UIInteraction', 'EvolutionPokemon', {
								action: 'Navigation'
							});
						}}
					>
						<Image src={evolution.targetSprite} alt={evolution.targetURL} classNames="sprite" />
					</a>
				</div>
			</div>
		{/each}
	{/if}
{/if}
