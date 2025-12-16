<script lang="ts">
	import Image from '$/ui/atoms/image/Image.svelte';
	import Button from '$/ui/atoms/button/Button.svelte';
	import type { APIPokemon } from '$/@types/api.pokecompanion';

	type Move = NonNullable<APIPokemon['moves']['black-2-white-2']>;

	export let move:
		| Move['levelup'][number]
		| Move['breed'][number]
		| Move['tm'][number]
		| Move['tutor'][number];
</script>

<a href={move.slug}>
	<Button isNested classes="w-full" data-umami-event="PokemonMove">
		<div class="inline-flex justify-between w-full">
			<div class="flex flex-col items-center justify-center gap-2 pr-3">
				<Image
					src={move.damageClass.icon}
					alt={move.damageClass.name}
					style={'max-width: 5rem; object-fit: contain;'}
				/>
				<Image
					src={move.type.icon}
					alt={move.type.name}
					style={'max-width: 5rem; object-fit: contain;'}
				/>
			</div>

			<div class="grid w-full justify-start">
				{#each move.names as name}
					<p>{name}</p>
				{/each}
			</div>

			<div class="level">
				{#if 'level' in move}
					<p class="w-max">Lv. {move.level}</p>
				{/if}
			</div>
		</div>
	</Button>
</a>

<style>
	a {
		text-decoration: none;
	}
</style>
