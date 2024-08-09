<script lang="ts">
	import type { ITypeRelations } from '$lib/data/generationAdjuster';
	import Type from '../../ui/atoms/type/Type.svelte';
	export let relations: ITypeRelations;
</script>

<div class="columns">
	<div class="column">
		<h3 class="h3">Resists</h3>
		{#each relations.resists as resists}
			<div class="inline-flex w-full justify-center mb-3 gap-3">
				<Type type={resists.name} style="max-height: 20px;" />

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
			<div class="inline-flex w-full justify-center mb-3 gap-3">
				<Type type={weakAgainst.name} style="max-height: 20px;" />

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

	p,
	b {
		width: 3rem;
	}
</style>
