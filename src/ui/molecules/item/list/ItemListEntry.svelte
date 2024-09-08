<script lang="ts">
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import { getMultiLanguageName, type Languages } from '$lib/utils/language';
	import Image from '$/ui/atoms/image';
	import Card from '$/ui/atoms/card/Card.svelte';
	import { createEventDispatcher } from 'svelte';

	export let item: {
		names: Languages[];
		id: number;
		name: string;
	};
	export let cardActiveState = false;
	export let style: string = '';
	export let isNested: boolean = false;
	export let isClickable: boolean = true;

	const dispatch = createEventDispatcher();
</script>

<Card
	id={`item-${item.id}`}
	{isClickable}
	{isNested}
	style={`position: relative; ${
		cardActiveState ? 'background-color: var(--card-hover);' : ''
	} ${style}`}
	classes="m-0 w-full w-full h-full flex p-8"
	on:click={() => {
		dispatch('click', item);
	}}
>
	<div class="spriteWrapper">
		<Image
			src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`}
			alt={`${getMultiLanguageName(item.names, $primaryLanguage, $secondaryLanguage)} sprite`}
			loading="lazy"
			height="48px"
			width="48px"
		/>
	</div>

	<span class="ml-4">
		{getMultiLanguageName(item.names, $primaryLanguage, $secondaryLanguage)}
	</span>

	<slot name="remove" />
</Card>

<style>
	.spriteWrapper {
		max-width: 48px;
		margin-right: 1.5rem;
	}

	span {
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
