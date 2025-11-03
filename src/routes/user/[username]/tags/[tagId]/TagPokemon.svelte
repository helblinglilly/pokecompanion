<script lang="ts">
	import PokemonCardEntry from '$/ui/molecules/pokemon/card';
	import { getPokemonEntry } from '$/lib/data/games';
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import { termNormaliser } from '$/lib/utils/string';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { type Writable } from 'svelte/store';
	import { getSortFunction } from './helper';
	import PokemonListEntry from '$/ui/molecules/pokemon/list';
	import PokemonLink from '$/ui/molecules/pokemon/link/PokemonLink.svelte';
	import type { APITag } from '$/@types/api.pokecompanion';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { paths } from '$/@types/api';
	import { addNotification } from '$/lib/stores/notifications';
	export let filterTerm: string;

	export let inModifyView: boolean;

	async function deletePokemonFromTag(pokemon: {
		variety: string;
		shiny: boolean;
		id: number;
		gender?: 'male' | 'female';
		added: string;
	}) {
		const res = await fetch(PUBLIC_API_HOST + `/tags/${$tag.id}/pokemon`, {
			method: 'DELETE',
			body: JSON.stringify({
				...pokemon
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		if (res.status === 200) {
			const body: paths['/tags/{tagId}/pokemon']['delete']['responses']['200']['content']['application/json'] =
				await res.json();
			tag.set(body);
		} else {
			addNotification({
				message: 'Failed to remove move from tag',
				level: 'failure'
			});
		}
	}

	let tag = getContext('tag') as Writable<APITag['tags'][number]>;

	$: pokemonCollection = $tag.contents.pokemon
		?.filter((mon) => {
			const normalised = termNormaliser(filterTerm);
			const matchesId = `${mon.id}`.includes(filterTerm);
			const names = termNormaliser(
				getMultiLanguageName(
					getPokemonEntry(mon.id).names,
					$primaryLanguage,
					$secondaryLanguage,
					mon.variety ?? ''
				) ?? ''
			);

			const matchesName = names.includes(normalised);
			return matchesId || matchesName;
		})
		.sort(
			getSortFunction(
				($page.url.searchParams.get('sortBy') ||
					$tag.sortKey) as unknown as APITag['tags'][number]['sortKey'],
				($page.url.searchParams.get('sortOrder') ||
					$tag.sortOrder) as unknown as APITag['tags'][number]['sortOrder']
			).sortFunction
		);
</script>

{#if !pokemonCollection || pokemonCollection.length === 0}
	<p>No Pokemon</p>
{:else if $page.url.searchParams.get('view') === 'card'}
	<h2 class="h2">Pokémon</h2>
	<div
		class="grid gap-8 justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl-grid-cols-6"
	>
		{#each pokemonCollection as pokemon}
			<PokemonLink {pokemon} isLinkHidden={inModifyView}>
				<PokemonCardEntry
					{pokemon}
					showGenderAndShiny={$tag.showGenderAndShiny}
					isClickable={!inModifyView}
				>
					<button
						slot="remove"
						class={`removeButton ${inModifyView ? '' : 'hidden'}`}
						on:click={async () => {
							await deletePokemonFromTag(pokemon);
						}}>-</button
					>
				</PokemonCardEntry>
			</PokemonLink>
		{/each}
	</div>
{:else}
	<h2 class="h2">Pokémon</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each pokemonCollection as pokemon}
			<PokemonLink {pokemon} isLinkHidden={inModifyView}>
				<PokemonListEntry {pokemon} showGenderAndShiny={$tag.showGenderAndShiny}>
					<button
						slot="remove"
						class={`removeButton ${inModifyView ? '' : 'hidden'}`}
						on:click={async () => {
							await deletePokemonFromTag(pokemon);
						}}>-</button
					>
				</PokemonListEntry>
			</PokemonLink>
		{/each}
	</div>
{/if}

<style>
	.removeButton {
		position: absolute;
		top: 0;
		right: 0;
		text-align: center;
		height: 2rem;
		width: 2rem;
		border-radius: 10%;
		font-weight: bold;
		color: var(--light);
		background-color: var(--error);
		z-index: 10;
	}
</style>
