<script lang="ts">
	import { marked } from 'marked';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import EditTag from '$/ui/molecules/tags/EditTag.svelte';
	import { currentUser } from '$lib/stores/user';
	import Card from '$/ui/atoms/Card.svelte';
	import Image from '$/ui/atoms/Image.svelte';
	import AttachedTags from '$/features/tags/AttachedTags.svelte';
	import { page } from '$app/state';
	import CreateNewTag from '$/features/tags/new/CreateNewTag.svelte';
	import type { LayoutData } from '../../$types.js';

	let { data } = $props();
	const layoutData = $derived(page.data) as LayoutData;
</script>

<SocialPreview
	title={`${data.item.name}`}
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/items.png"
/>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
	<Card classes="relative grid text-center">
		<div class="columns mobile py-2 w-full">
			<div class="column spriteBoxWrapper grid justify-center">
				<Image
					src={data.item.icon}
					alt={'icon'}
					isSprite
					style="max-width: 128px; min-width: 128px;"
				/>
			</div>
		</div>
		<h1 class="text-xl font-bold">{data.item.name}</h1>
	</Card>

	<Card>
		<table class="w-full">
			<tbody>
				<tr class="pb-16">
					<td> Price </td>
					<td>
						₽{data.item.price}
					</td>
				</tr>
				<tr class="pb-4">
					<td> Holdable </td>
					<td>
						{data.item.attributes.holdable ? 'Yes' : 'No'}
					</td>
				</tr>
				<tr class="pb-4">
					<td>Actively holdable </td>
					<td>
						{data.item.attributes.holdableActive ? 'Yes' : 'No'}
					</td>
				</tr>
				<tr class="pb-4">
					<td>Passively holdable </td>
					<td>
						{data.item.attributes.holdablePassive ? 'Yes' : 'No'}
					</td>
				</tr>
				<tr class="pb-4">
					<td>Overworld usable </td>
					<td>
						{data.item.attributes.overworld ? 'Yes' : 'No'}
					</td>
				</tr>
				<tr class="pb-4">
					<td>Underground usable </td>
					<td>
						{data.item.attributes.underground ? 'Yes' : 'No'}
					</td>
				</tr>
				<tr>
					<td>Stackable </td>
					<td>
						{data.item.attributes.countable ? 'Yes' : 'No'}
					</td>
				</tr>
			</tbody>
		</table>
	</Card>

	<Card>
		{#if data.item.flavourTexts?.length > 0}
			{#each data.item.flavourTexts as text}
				<p class="text-center">{text}</p>
			{/each}
			<hr />
		{/if}

		{#if data.item.effectEntries.length > 0}
			{#each data.item.effectEntries as effectEntry}
				<div class="prose prose-sm max-w-none grid justify-center">
					<p>
						{effectEntry}
					</p>
				</div>
			{/each}
		{/if}
	</Card>

	<!-- {#if $currentUser}
			<hr />

			<div class="grid gap-2">
				<div class="flex justify-center w-full gap-2">
					<AttachedTags move={data.move} />
				</div>

				<div class="w-full flex justify-center gap-2">
					{#if layoutData.tags.tags.length > 0}
						<div class="my-auto">
							<EditTag move={{ id: data.move.id }} />
						</div>
					{/if}

					<div class="my-auto">
						<CreateNewTag move={[{ id: data.move.id }]} />
					</div>
				</div>
			</div>
		{/if} -->
</div>

<style>
	hr {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
</style>
