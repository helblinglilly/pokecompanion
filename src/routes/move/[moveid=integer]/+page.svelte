<script lang="ts">
	import { marked } from 'marked';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import Card from '$/ui/atoms/Card.svelte';
	import Image from '$/ui/atoms/Image.svelte';

	let { data } = $props();
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
				classNames="mr-3 move-detail-icon"
			/>
			<div class="inline-flex justify-between w-full">
				<p>
					{data.move.name}
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
					<tr>
						<th>Category</th>
						<th>Power</th>
						<th>Accuracy</th>
					</tr>
				</thead>
				<tbody>
					<tr class="text-center">
						<td>
							<Image
								src={data.move.damageClass.icon}
								alt={`${data.move.damageClass.name} type`}
								classNames="mx-auto move-detail-icon"
							/>
						</td>
						<td>{data.move.power ?? '-'}</td>
						<td>{data.move.accuracy ?? '-'}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<hr />

		{#if data.move.flavourTexts?.length > 0}
			{#each data.move.flavourTexts as text}
				<p class="text-center">{text}</p>
			{/each}
			<hr />
		{/if}

		{#if data.move.effectEntries.length > 0}
			{#each data.move.effectEntries as effectEntry}
				<div class="prose prose-sm max-w-none grid justify-center">
					{@html marked(effectEntry)}
				</div>
			{/each}
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
	:global(.move-detail-icon) {
		max-width: 5rem;
		max-height: 20px;
		object-fit: contain;
	}

	hr {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	table {
		width: 100%;
	}
</style>
