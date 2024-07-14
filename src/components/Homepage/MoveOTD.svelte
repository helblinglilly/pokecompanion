<script lang="ts">
	/**
	 * Styling:
	 * Tailwind will take a while to load and apply, especially on slower network
	 * conntections
	 *
	 * Styling elements that affect the layout have been done inline to avoid
	 * layout shift as the site/assets load in
	 *
	 */

	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { getMove, type IMove } from '$lib/types/IMoves';
	import { getNameEntry } from '$lib/utils/language';
	import { onMount } from 'svelte';
	import Type from '../Type.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';

	export let id: number;
	let move: IMove | undefined;

	onMount(async () => {
		move = await getMove(id, $selectedGame);
	});

	$: primaryName = move ? getNameEntry(move.names, $primaryLanguage) : undefined;
	$: secondaryName =
		move && $secondaryLanguage ? getNameEntry(move.names, $secondaryLanguage) : undefined;
</script>

<Card isClickable classes="relative no-underline p-0 h-full max-h-52">
	<a
		href={`/move/${id}`}
		class="no-underline clickable p-4 rounded-lg inline-flex gap-4"
		style="height: 100%; width: 100%; justify-content: center;"
	>
		{#if move}
			<div class="grid gap-2 content-center">
				<Type type={move.type.name} className="ml-auto mr-auto" />
				<Type type={move.damage_class.name} className="ml-auto mr-auto" />
			</div>

			<div class="mt-auto mb-auto">
				<p>{primaryName}</p>
				{#if secondaryName && primaryName !== secondaryName}
					<p>{secondaryName}</p>
				{/if}
			</div>
		{:else}
			<p>Loading...</p>
		{/if}
	</a>
</Card>
