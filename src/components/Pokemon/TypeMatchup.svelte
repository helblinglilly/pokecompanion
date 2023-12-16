<script lang="ts">
	import Image from '$components/Image.svelte';
	import type { ITypeRelations } from '$lib/data/generationAdjuster';
	export let relations: ITypeRelations;
</script>

<div class="columns mobile">
	<div class="column">
		<h2>Resists</h2>
		{#each relations.resists as resists}
			<div class="type">
				<Image src={resists.icon} alt={resists.name} />
				{#if resists.multiplier === 0}
					<b>x {resists.multiplier}</b>
				{:else}
					<p>x {resists.multiplier}</p>
				{/if}
			</div>
		{/each}
	</div>
	<div class="column">
		<h2>Weak to</h2>
		{#each relations.weakAgainst as weakAgainst}
			<div class="type">
				<Image src={weakAgainst.icon} alt={weakAgainst.name} />
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
		width: 2.5rem;
	}
</style>
