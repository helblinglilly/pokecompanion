<script lang="ts">
	import PokemonCardEntry from '$/ui/molecules/pokemon/card';
	import { page } from '$app/state';
	import PokemonListEntry from '$/ui/molecules/pokemon/list';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { paths } from '$/@types/api';
	import { addNotification } from '$/features/notifications/notifications';
	import { termNormaliser } from '$/lib/utils/string';
	import { invalidate } from '$app/navigation';
	import type { APITag } from '$/features/tags/types';

	async function deletePokemonFromTag(pokemon: {
		variety: string;
		shiny: boolean;
		id: number;
		gender?: 'male' | 'female';
	}) {
		const res = await fetch(PUBLIC_API_HOST + `/tags/${tag.id}/pokemon`, {
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
			invalidate(`tag:${tag.id}`);
		} else {
			addNotification({
				message: 'Failed to remove move from tag',
				level: 'failure'
			});
		}
	}

	interface Props {
		inModifyView: boolean;
		filterTerm: string;
		allPokemon: paths['/tags/{tagId}/pokemon']['get']['responses']['200']['content']['application/json'];
		tag: APITag['tags'][number];
	}

	let { inModifyView, filterTerm, allPokemon, tag }: Props = $props();

	let pokemonCollection = $derived(
		allPokemon?.filter((pokemon) => {
			if (!filterTerm) {
				return true;
			}
			const normalised = termNormaliser(filterTerm);
			const matchesId = `${pokemon.id}`.includes(normalised);

			const matchesName = termNormaliser(pokemon.name).includes(normalised);
			return matchesId || matchesName;
		})
	);
</script>

{#if pokemonCollection.length === 0}
	<p>No Pokemon</p>
{:else}
	<h2 class="h2">Pokémon</h2>

	<div
		class={`grid ${
			page.url.searchParams.get('view') === 'card'
				? 'gap-8 justify-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl-grid-cols-6'
				: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
		}`}
	>
		{#each pokemonCollection as pokemon}
			<a
				href={inModifyView ? undefined : pokemon.slug}
				style="text-decoration-line: unset; width: 100%;"
			>
				{#if page.url.searchParams.get('view') === 'card'}
					<PokemonCardEntry
						{pokemon}
						shiny={pokemon.shiny}
						gender={pokemon.gender}
						showGenderAndShiny={tag.showGenderAndShiny}
						isClickable={!inModifyView}
					>
						{#snippet remove()}
							<button
								class={`removeButton ${inModifyView ? '' : 'hidden'}`}
								onclick={async () => {
									await deletePokemonFromTag({
										...pokemon,
										shiny: pokemon.shiny ?? false
									});
								}}>-</button
							>
						{/snippet}
					</PokemonCardEntry>
				{:else}
					<PokemonListEntry
						{pokemon}
						shiny={pokemon.shiny}
						gender={pokemon.gender}
						showGenderAndShiny={tag.showGenderAndShiny}
					>
						{#snippet remove()}
							<button
								class={`removeButton ${inModifyView ? '' : 'hidden'}`}
								onclick={async () => {
									await deletePokemonFromTag({
										...pokemon,
										shiny: pokemon.shiny ?? false
									});
								}}>-</button
							>
						{/snippet}
					</PokemonListEntry>
				{/if}
			</a>
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
