<script lang="ts">
	import PokemonPreview from '$components/Pokemon/PokemonPreview.svelte';
	import Image from '$components/UI/Image.svelte';
	import type { IGame } from '$lib/data/games';
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import type { IMove } from '$lib/types/IMoves.js';
	import { getNameEntries, joinNameEntries } from '$lib/utils/language';

	export let data;

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
</script>

<h1 class="h2">
	{joinNameEntries(getNameEntries(data.move.names, $primaryLanguage, $secondaryLanguage), '-')}
</h1>

<div class="columns">
	<div class="column">
		<h2 class="h3">Overview</h2>
		<div class="card">
			<div id="moveCard">
				<Image
					src={`/icons/types/${data.move.type.name}.webp`}
					alt={data.move.type.name}
					style="margin-right: 4px; width: 50px;"
				/>

				<div style="display: inline-flex; justify-content: space-between; width: 100%;">
					<p>
						{joinNameEntries(
							getNameEntries(data.move.names, $primaryLanguage, $secondaryLanguage),
							'-'
						)}
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
		</div>
	</div>
	<div class="column">
		<h2 class="h3">Can be learnt by</h2>
		{#each data.move.learned_by_pokemon as pokemon}
			<div style="width: 100%;">
				<PokemonPreview pokemon={{ id: Number(pokemon.url.split('/')[6]) }} />
			</div>
		{/each}
	</div>
</div>
<div class="columns" />

<style>
	#moveCard {
		display: inline-flex;
	}

	@media screen and (max-width: 768px) {
		#moveCard {
			width: 100%;
		}
	}

	@media screen and (min-width: 768px) {
		#moveCard {
			width: 100%;
			height: auto;
		}
	}
</style>
