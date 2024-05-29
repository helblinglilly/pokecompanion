<script lang="ts">
	import Type from '$/components/Type.svelte';
	import Image from '$/components/UI/Image.svelte';
	import adjustMoveForGame from '$/lib/gameAdjustors/move';
	import type { IMove } from '$/lib/types/IMoves';
	import type { IPokemonMinimalMove } from '$/routes/api/pokemon/types';
	import { Logger } from '$lib/log';
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { getNameEntry } from '$lib/utils/language';

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

	$: pokeapiPromise = getPokeapiMove();

	$: primaryName = move ? getNameEntry(move.names, $primaryLanguage) : undefined;
	$: secondaryName =
		move && $secondaryLanguage ? getNameEntry(move.names, $secondaryLanguage) : undefined;
</script>

<button class="button secondary">
	{#if move}
		<a
			href={`/move/${move.id}`}
			on:click={() => {
				Logger.addPageAction('UIInteraction', 'Move', {
					action: 'Navigation'
				});
			}}
		>
			<table>
				<tbody>
					<tr>
						<td class="types">
							{#await pokeapiPromise}
								<Type type={move.type.name} style="margin-bottom: 0.2rem;" />
								<Type type={move.damage_class.name} style="width: 50px;" />
							{:then pokeapi}
								<Type type={pokeapi?.type.name ?? move.type.name} style="margin-bottom: 0.2rem;" />
								<Type
									type={pokeapi?.damage_class.name ?? move.damage_class.name}
									style="width: 50px;"
								/>
							{:catch error}
								<p>{error.message}</p>
							{/await}
						</td>
						<td class="name">
							<p>{primaryName}</p>
							{#if secondaryName && primaryName !== secondaryName}
								<p>{secondaryName}</p>
							{/if}
						</td>
						{#if move.level}
							<td class="requirements">
								Lv. {move.level}
							</td>
						{/if}
					</tr>
				</tbody>
			</table>
		</a>
	{:else}
		<p>Loading...</p>
	{/if}
</button>

<style>
	a {
		text-decoration: none;
	}
	table {
		width: 100%;
	}
	td {
		justify-content: start;
	}

	.types {
		width: 55px;
	}
	.name > p {
		text-align: start;
	}
	.requirements {
		text-align: end;
		padding-right: 1rem;
	}

	button {
		width: 100%;
		border-radius: 0.5rem;
		padding-left: 1rem;
		padding-right: 0.5rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
	}
</style>
