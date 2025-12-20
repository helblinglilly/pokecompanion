<script lang="ts">
	import type { APIPokemon } from '$/@types/api.pokecompanion';
	import Image from '$/ui/atoms/image/Image.svelte';
	interface Props {
		types: APIPokemon['types'];
	}

	let { types }: Props = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2">
	<div class="text-center">
		<h3 class="h3">Resists</h3>
		{#each types.resists as resists}
			<div class="inline-flex w-full justify-center mb-2 gap-3">
				<div>
					<Image
						src={resists.icon}
						alt={resists.name}
						style={'h-6 object-fit: contain; max-width: 5rem; max-height: 20px;'}
					/>
				</div>

				{#if resists.multiplier === 0}
					<b>x {resists.multiplier}</b>
				{:else}
					<p>x {resists.multiplier}</p>
				{/if}
			</div>
		{/each}
	</div>

	<div class="text-center">
		<h3 class="h3">Weak to</h3>
		{#each types.weakAgainst as weakAgainst}
			<div class="inline-flex w-full justify-center mb-2 gap-3">
				<div>
					<Image
						src={weakAgainst.icon}
						alt={weakAgainst.name}
						style={'h-6 object-fit: contain; max-width: 5rem; max-height: 20px;'}
					/>
				</div>

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
	p,
	b {
		width: 3rem;
	}
</style>
