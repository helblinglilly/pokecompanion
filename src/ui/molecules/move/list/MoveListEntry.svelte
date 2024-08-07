<script lang="ts">
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { getMove, type IMove } from '$lib/types/IMoves';
	import { getNameEntry } from '$lib/utils/language';
	import Type from '../../../atoms/type/Type.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import { createEventDispatcher } from 'svelte';
	import { getGameGroupFromName, type PokeapiVersionGroups } from '$/lib/data/games';

	export let id: number;
	export let cardActiveState = false;
	export let style: string = '';
	export let isNested: boolean = false;
	export let game: PokeapiVersionGroups | undefined = $selectedGame?.pokeapi;
	let move: IMove | undefined;

	const dispatch = createEventDispatcher();

	$: {
		(async () => {
			move = await getMove(id, getGameGroupFromName(game));
		})();
	}

	// Reactive statements to update names whenever move or languages change
	$: primaryName = move ? getNameEntry(move.names, $primaryLanguage) : undefined;
	$: secondaryName =
		move && $secondaryLanguage ? getNameEntry(move.names, $secondaryLanguage) : undefined;
</script>

<Card
	id={`move-${id}`}
	isClickable
	{isNested}
	style={`position: relative; ${
		cardActiveState ? 'background-color: var(--card-hover);' : ''
	} ${style}`}
	classes="m-0 w-full w-full h-full flex p-8"
	on:click={() => {
		dispatch('click', move);
		// cardActiveState = true;
	}}
>
	{#if move}
		<div>
			<table>
				<tbody>
					<tr>
						<td class="types">
							<Type
								type={move.type.name}
								style="margin-bottom: 0.2rem; margin-left: auto; margin-right: auto;"
								{game}
							/>

							<Type
								type={move.damage_class.name}
								style="margin-left: auto; margin-right: auto;"
								{game}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<span class="ml-4">
			<p>{primaryName}</p>
			{#if secondaryName && primaryName !== secondaryName}
				<p>{secondaryName}</p>
			{/if}
		</span>
	{:else}
		<p>Loading...</p>
	{/if}

	<slot name="remove" />
</Card>

<style>
	.spriteWrapper {
		height: 96px;
		width: 96px;
		padding: 1rem;
		margin-top: auto;
		margin-bottom: auto;
	}
	table {
		width: 100%;
		height: 100%;
	}
	td {
		justify-content: start;
	}

	span {
		margin-top: auto;
		margin-bottom: auto;
	}

	.types {
		width: 55px;
	}

	.removeButton {
		position: absolute;
		top: 0;
		right: 0;
		text-align: center;
		height: 2rem;
		width: 2rem;
		border-radius: 10%;
		font-weight: bold;
		color: var(--light);
		background-color: var(--error);
		z-index: 5;
	}
</style>
