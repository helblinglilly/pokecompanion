<script lang="ts">
	import Type from '$/ui/atoms/type/Type.svelte';
	import adjustMoveForGame from '$/lib/gameAdjustors/move';
	import type { IMove } from '$/lib/types/IMoves';
	import type { IPokemonMinimalMove } from '$/routes/api/pokemon/types';
	import { Logger } from '$lib/log';
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { getNameEntry } from '$lib/utils/language';
	import Button from '$/ui/atoms/button/Button.svelte';
	import { onMount } from 'svelte';

	export let move: IPokemonMinimalMove;

	const getPokeapiMove = async () => {
		try {
			const res = await fetch(`https://pokeapi.co/api/v2/move/${move.id}`);
			if (!res.ok) {
				throw new Error('Non-200 status when fetching move client side');
			}
			const rawMove = (await res.json()) as IMove;
			return adjustMoveForGame(rawMove, $selectedGame?.pokeapi);
		} catch {
			return;
		}
	};

	// Initialize to a resolved promise so the {#await} block has something immediately
	let pokeapiPromise: Promise<IMove | undefined> = Promise.resolve(undefined);

	onMount(() => {
		pokeapiPromise = getPokeapiMove();
	});

	$: primaryName = move ? getNameEntry(move.names, $primaryLanguage) : undefined;
	$: secondaryName =
		move && $secondaryLanguage ? getNameEntry(move.names, $secondaryLanguage) : undefined;
</script>

{#if move}
	<a href={`/move/${move.id}`}>
		<Button isNested classes="w-full" data-umami-event="PokemonMove">
			<div class="inline-flex justify-between w-full">
				<div class="flex flex-col items-center justify-center gap-2 pr-3">
					{#await pokeapiPromise}
						<Type type={move.type.name} />
						<Type type={move.damage_class.name} />
					{:then pokeapi}
						<Type type={pokeapi?.type.name ?? move.type.name} />
						<Type type={pokeapi?.damage_class.name ?? move.damage_class.name} />
					{:catch error}
						<p>{error.message}</p>
					{/await}
				</div>

				<div class="grid w-full justify-start">
					<p class="text-left">{primaryName}</p>
					{#if secondaryName && primaryName !== secondaryName}
						<p class="text-left">{secondaryName}</p>
					{/if}
				</div>

				<div class="level">
					{#if move.level}
						<p class="w-max">
							Lv. {move.level}
						</p>
					{/if}
				</div>
			</div>
		</Button>
	</a>
{:else}
	<p>Loading...</p>
{/if}

<style>
	a {
		text-decoration: none;
	}
</style>
