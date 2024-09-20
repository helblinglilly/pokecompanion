<script lang="ts">
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import CreateNewTag from '$/ui/molecules/Collections/Tags/CreateNewTag/CreateNewTag.svelte';
	import SelectedTags from '$/ui/molecules/tags/SelectedTags.svelte';
	import EditTag from '$/ui/molecules/tags/EditTag.svelte';
	import type { IGameGroups } from '$lib/data/games';
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { tagStore } from '$lib/stores/tags.js';
	import { currentUser } from '$lib/stores/user';
	import type { IMove } from '$lib/types/IMoves.js';
	import { getNameEntries, joinNameEntries } from '$lib/utils/language';
	import Type from '$/ui/atoms/type/Type.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import PokemonGroup from './PokemonGroup.svelte';

	export let data;
	let filterTerm = '';

	const findFlavourEntry = (
		move: IMove,
		languageCode: string | undefined,
		selectedGame?: IGameGroups | undefined
	) => {
		const entry = move.flavor_text_entries.find((entry) => {
			if (selectedGame) {
				return (
					entry.language.name === languageCode && entry.version_group.name === selectedGame.pokeapi
				);
			}
			return entry.language.name === languageCode;
		});
		if (!entry) {
			return '';
		}
		return entry.flavor_text;
	};

	const findEffectEntry = (move: IMove, language: string | undefined) => {
		const effect = move.effect_entries.find((entry) => {
			return entry.language.name === language;
		});

		return effect?.effect ?? '';
	};

	$: primaryFlavourText = findFlavourEntry(data.move, $primaryLanguage, $selectedGame);
	$: secondaryFlavourText = findFlavourEntry(data.move, $secondaryLanguage, $selectedGame);

	$: primaryEffectEntry = findEffectEntry(data.move, $primaryLanguage);
	$: secondaryEffectEntry = findEffectEntry(data.move, $secondaryLanguage);

	$: names = getNameEntries(data.move.names, $primaryLanguage, $secondaryLanguage);
</script>

<SocialPreview
	title={`${names.primary ?? names.secondary}`}
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/moves.png"
	description={primaryEffectEntry ?? secondaryEffectEntry}
/>

<div class="w-full inline-flex justify-center">
	<Card classes="w-full md:max-w-[75%]">
		<div class="inline-flex w-full">
			<Type type={data.move.type.name} className="mr-3" style="max-height: 20px;" />
			<div class="inline-flex justify-between w-full">
				<p>
					{joinNameEntries(names, '-')}
				</p>

				<p>
					{data.move.pp}/{data.move.pp} PP
				</p>
			</div>
		</div>

		<hr />

		<div>
			<table>
				<thead>
					<th>Category</th>
					<th>Power</th>
					<th>Accuracy</th>
				</thead>
				<tbody>
					<tr class="text-center">
						<td>
							<Type
								type={data.move.damage_class.name}
								className="ml-auto mr-auto"
								style="max-height: 20px;"
							/>
						</td>
						<td>{data.move.power ?? '-'}</td>
						<td>{data.move.accuracy ?? '-'}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<hr />

		{#if primaryFlavourText || secondaryFlavourText}
			<p>{primaryFlavourText ?? secondaryFlavourText}</p>

			<hr />
		{/if}

		{#if primaryEffectEntry}
			<p>{primaryEffectEntry}</p>
		{/if}
		{#if secondaryEffectEntry}
			<p>{secondaryEffectEntry}</p>
		{/if}

		{#if !primaryEffectEntry && !secondaryEffectEntry}
			<p>{findEffectEntry(data.move, 'en')}</p>
		{/if}

		{#if $currentUser}
			<hr />

			<div class="grid gap-2">
				<div class="flex justify-center w-full gap-2">
					<SelectedTags move={data.move} />
				</div>

				<div class="w-full flex justify-center gap-2">
					{#if $tagStore.length > 0}
						<div class="my-auto">
							<EditTag move={{ id: data.move.id }} />
						</div>
					{/if}

					<div class="my-auto">
						<CreateNewTag
							move={{
								id: data.move.id
							}}
						/>
					</div>
				</div>
			</div>
		{/if}
	</Card>
</div>

<div style="padding-top: 2rem;">
	<div class="md:max-w-[75%] mx-auto grid gap-4">
		<div class="inline-flex flex-col md:flex-row w-full gap-4 justify-between">
			<h2 class="h2 w-fit">Pokémon that can learn {names.primary ?? names.secondary}</h2>
			{#if data.move.learned_by_pokemon.length > 10}
				<input
					type="text"
					placeholder="Filter"
					class="w-full md:w-fit h-12"
					bind:value={filterTerm}
				/>
			{/if}
		</div>

		<!-- Replace this with a manual implementation like on search results -->
		<PokemonGroup
			pokemonResults={data.move.learned_by_pokemon.map((val) => {
				return { id: Number(val.url.split('/')[6]) };
			})}
			showMoreText="Show more"
			{filterTerm}
		/>
	</div>
</div>

<style>
	hr {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	table {
		width: 100%;
	}
</style>
