<script lang="ts">
	import Image from '$/components/UI/Image.svelte';
	import { selectedGame } from '$/lib/stores/domain';
	import type { ITypeRelations } from '$lib/data/generationAdjuster';
	import Type from '../Type.svelte';
	export let relations: ITypeRelations;
</script>

<div class="columns mobile">
	<div class="column">
		<h3 class="h3">Resists</h3>
		{#each relations.resists as resists}
			<div class="type">
				<Type type={resists.name} />

				{#if resists.multiplier === 0}
					<b>x {resists.multiplier}</b>
				{:else}
					<p>x {resists.multiplier}</p>
				{/if}
			</div>
		{/each}
	</div>
	<div class="column">
		<h3 class="h3">Weak to</h3>
		{#each relations.weakAgainst as weakAgainst}
			<div class="type">
				<Type type={weakAgainst.name} />

				{#if weakAgainst.multiplier === 4}
					<b>x {weakAgainst.multiplier}</b>
				{:else}
					<p>x {weakAgainst.multiplier}</p>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.column {
		text-align: center;
	}

	.type {
		display: inline-flex;
		min-width: max-content;
		width: 100%;
		gap: 0.5rem;
		justify-content: center;
	}

	p,
	b {
		width: 3rem;
	}
</style>
