<script lang="ts">
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import CreateNewTag from '$/ui/molecules/Collections/Tags/CreateNewTag.svelte';
	import SelectedTags from '$/ui/molecules/tags/SelectedTags.svelte';
	import EditTag from '$/ui/molecules/tags/EditTag.svelte';
	import { tagStore } from '$lib/stores/tags.js';
	import { currentUser } from '$lib/stores/user';
	import Card from '$/ui/atoms/card/Card.svelte';
	import Image from '$/ui/atoms/image';

	export let data;
</script>

<SocialPreview
	title={`${data.move.name}`}
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/moves.png"
	description={data.move.effectEntries[0]}
/>

<div class="w-full inline-flex justify-center">
	<Card classes="w-full md:max-w-[75%]">
		<div class="inline-flex w-full">
			<Image
				src={data.move.type.icon}
				alt={`${data.move.type.name} type`}
				classNames="mr-3"
				style={`object-fit: contain; max-width: 5rem; max-height: 20px;`}
			/>
			<div class="inline-flex justify-between w-full">
				<p>
					{data.move.name}
				</p>

				<p>
					<!-- {data.move.}/{data.move.pp} PP -->
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
					<!-- <tr class="text-center">
						<td>
							<Type
								type={data.move.damage_class.name}
								className="ml-auto mr-auto"
								style="max-height: 20px;"
							/>
						</td>
						<td>{data.move.power ?? '-'}</td>
						<td>{data.move.accuracy ?? '-'}</td>
					</tr> -->
				</tbody>
			</table>
		</div>
		<hr />

		<!-- {#if primaryFlavourText || secondaryFlavourText}
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
		{/if} -->

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

<!--
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
<!--
		<PokemonGroup
			pokemonResults={data.move.learned_by_pokemon.map((val) => {
				return { id: Number(val.url.split('/')[6]) };
			})}
			showMoreText="Show more"
			{filterTerm}
		/>
	</div>
</div> -->

<style>
	hr {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	table {
		width: 100%;
	}
</style>
