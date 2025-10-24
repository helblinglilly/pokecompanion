<script lang="ts">
	import Type from '$/ui/atoms/type/Type.svelte';
	import adjustMoveForGame from '$/lib/gameAdjustors/move';
	import type { IMove } from '$/lib/types/IMoves';
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { getNameEntry } from '$lib/utils/language';
	import Button from '$/ui/atoms/button/Button.svelte';
	import { onMount } from 'svelte';
	import type { paths } from '$/@types/api';

	type Move = NonNullable<
		paths['/pokemon/v1/{id}']['get']['responses']['200']['content']['application/json']['moves']['black-2-white-2']
	>;

	export let move:
		| Move['levelup'][number]
		| Move['breed'][number]
		| Move['tm'][number]
		| Move['tutor'][number];

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

	// Promise starts resolved so the {#await} block renders immediately without SSR fetch.
	let pokeapiPromise: Promise<IMove | undefined> = Promise.resolve(undefined);

	onMount(() => {
		pokeapiPromise = getPokeapiMove();
	});
</script>

<a href={`/move/${move.id}`}>
	{#await pokeapiPromise}
		<Button isNested classes="w-full" data-umami-event="PokemonMove">
			<div class="inline-flex justify-between w-full">
				<!-- Loading fallback (no type/damage_class yet) -->
				<div class="flex flex-col items-center justify-center gap-2 pr-3">
					<p class="text-xs opacity-70">Loading…</p>
				</div>

				<div class="grid w-full justify-start">
					<p class="text-left">Move #{move.id}</p>
				</div>

				<div class="level">
					{#if 'level' in move}
						<p class="w-max">Lv. {move.level}</p>
					{/if}
				</div>
			</div>
		</Button>
	{:then pokeapi}
		<Button isNested classes="w-full" data-umami-event="PokemonMove">
			<div class="inline-flex justify-between w-full">
				<div class="flex flex-col items-center justify-center gap-2 pr-3">
					{#if pokeapi}
						<Type type={pokeapi.type.name} />
						<Type type={pokeapi.damage_class.name} />
					{:else}
						<p class="text-xs opacity-70">Unavailable</p>
					{/if}
				</div>

				<div class="grid w-full justify-start">
					{#if pokeapi}
						{#if $primaryLanguage}
							{#key $primaryLanguage}
								<p class="text-left">
									{getNameEntry(pokeapi.names, $primaryLanguage)}
								</p>
							{/key}
						{/if}

						{#if $secondaryLanguage}
							{#if getNameEntry(pokeapi.names, $secondaryLanguage) !== getNameEntry(pokeapi.names, $primaryLanguage) && getNameEntry(pokeapi.names, $secondaryLanguage)}
								<p class="text-left">
									{getNameEntry(pokeapi.names, $secondaryLanguage)}
								</p>
							{/if}
						{/if}
					{:else}
						<p class="text-left">Move #{move.id}</p>
					{/if}
				</div>

				<div class="level">
					{#if 'level' in move}
						<p class="w-max">Lv. {move.level}</p>
					{/if}
				</div>
			</div>
		</Button>
	{:catch error}
		<Button isNested classes="w-full" data-umami-event="PokemonMove">
			<div class="inline-flex justify-between w-full">
				<p class="text-left text-error">Error: {error.message}</p>
			</div>
		</Button>
	{/await}
</a>

<style>
	a {
		text-decoration: none;
	}
</style>
