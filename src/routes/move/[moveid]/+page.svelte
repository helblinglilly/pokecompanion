<script lang="ts">
	import SocialPreview from '$components/SocialPreview.svelte';
	import CreateNewTag from '$components/Tags/CreateNewTag.svelte';
	import SelectedTags from '$components/Tags/SelectedTags.svelte';
	import EditTag from '$components/Tags/EditTag.svelte';
	import Image from '$components/UI/Image.svelte';
	import PokemonGroup from '$components/UI/PokemonGroup.svelte';
	import type { IGame } from '$lib/data/games';
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { tagStore } from '$lib/stores/tagsStore.js';
	import { currentUser } from '$lib/stores/user';
	import type { IMove } from '$lib/types/IMoves.js';
	import { getNameEntries, joinNameEntries } from '$lib/utils/language';

	export let data;
	let filterTerm = '';

	const findFlavourEntry = (
		move: IMove,
		languageCode: string | undefined,
		selectedGame?: IGame | undefined
	) => {
		const entry = move.flavor_text_entries.find((entry) => {
			if (selectedGame) {
				return (
					entry.language.name === languageCode &&
					entry.version_group.name === selectedGame.pokeapiVersionGroup
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

		if (!effect) {
			return '';
		}

		return effect.effect.replaceAll('$effect_chance', move.effect_chance?.toString());
	};

	$: primaryFlavourText = findFlavourEntry(data.move, $primaryLanguage, $selectedGame);
	$: secondaryFlavourText = findFlavourEntry(data.move, $secondaryLanguage, $selectedGame);

	$: primaryEffectEntry = findEffectEntry(data.move, $primaryLanguage);
	$: secondaryEffectEntry = findEffectEntry(data.move, $secondaryLanguage);

	$: names = getNameEntries(data.move.names, $primaryLanguage, $secondaryLanguage);
</script>

<SocialPreview
	title={`${names.primary ?? names.secondary}`}
	previewImage="/socialpreview/moves.png"
	description={primaryEffectEntry ?? secondaryEffectEntry}
/>

<div style="width: 100%; display: inline-flex; justify-content: center;">
	<div class="card centeredDesktopContent">
		<div style="display: inline-flex; width: 100%;">
			<Image
				src={`/icons/types/${data.move.type.name}.webp`}
				alt={data.move.type.name}
				style="margin-right: 4px; width: 50px;"
			/>

			<div style="display: inline-flex; justify-content: space-between; width: 100%;">
				<p>
					{joinNameEntries(names, '-')}
				</p>

				<p>
					{data.move.pp}/{data.move.pp} PP
				</p>
			</div>
		</div>

		<hr style="margin-top: 1rem; margin-bottom: 1rem;" />

		<div>
			<table style="width: 100%;">
				<thead>
					<th>Category</th>
					<th>Power</th>
					<th>Accuracy</th>
				</thead>
				<tbody>
					<tr style="text-align: center;">
						<td
							><Image
								src={`/icons/types/damage/${data.move.damage_class.name}.png`}
								alt={''}
								width="50px"
								height="20px"
								style="margin-left: auto; margin-right: auto;"
							/></td
						>
						<td>{data.move.power ?? '-'}</td>
						<td>{data.move.accuracy ?? '-'}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<hr style="margin-top: 1rem; margin-bottom: 1rem;" />
		<p>{primaryFlavourText ?? secondaryFlavourText}</p>

		<hr style="margin-top: 1rem; margin-bottom: 1rem;" />

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

			<div style="display: flex; justify-content: center; width: 100%; flex-flow: wrap;">
				<SelectedTags userId={$currentUser.id} moveId={data.move.id} />
				{#if $tagStore.length > 0}
					<EditTag userId={$currentUser.id} move={{ id: data.move.id }} />
				{/if}
				<CreateNewTag
					userId={$currentUser.id}
					initialContent={{
						move: [
							{
								id: data.move.id
							}
						]
					}}
				/>
			</div>
		{/if}
	</div>
</div>

<div style="padding-top: 2rem;">
	<div class="centeredDesktopContent">
		<div class="columns">
			<div class="column">
				<h2 class="h2">Pokémon that can learn {names.primary ?? names.secondary}</h2>
			</div>
			{#if data.move.learned_by_pokemon.length > 10}
				<div class="column">
					<input
						style="height: 3rem; padding-left: 2rem; width: 100%;"
						type="text"
						placeholder="Filter"
						bind:value={filterTerm}
					/>
				</div>
			{/if}
		</div>

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
	@media screen and (min-width: 768px) {
		.centeredDesktopContent {
			max-width: 800px;
			margin-left: auto;
			margin-right: auto;
		}
	}
</style>
