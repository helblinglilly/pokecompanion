<script lang="ts">
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { getMove, type IMove } from '$lib/types/IMoves';
	import { getNameEntry } from '$lib/utils/language';
	import { onMount } from 'svelte';
	import Card from '$/ui/atoms/card';
	import Type from '$/ui/atoms/type';

	export let id: number;
	export let isClickable: boolean = true;
	let move: IMove | undefined;

	onMount(async () => {
		move = await getMove(id, $selectedGame);
	});

	$: primaryName = move ? getNameEntry(move.names, $primaryLanguage) : undefined;
	$: secondaryName =
		move && $secondaryLanguage ? getNameEntry(move.names, $secondaryLanguage) : undefined;
</script>

<Card
	{isClickable}
	id={`move-${id}`}
	classes="relative h-auto"
	style={` min-height: 150px; padding: 0;`}
>
	{#if move}
		<div class="spriteWrapper">
			<table>
				<tbody>
					<tr>
						<td class="types">
							<Type
								type={move.type.name}
								style="margin-bottom: 0.2rem; margin-left: auto; margin-right: auto;"
							/>

							<Type type={move.damage_class.name} style="margin-left: auto; margin-right: auto;" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<p class="text-center">
			{primaryName}{secondaryName && primaryName !== secondaryName ? ` ${secondaryName}` : ''}
		</p>
	{:else}
		<p>Loading...</p>
	{/if}

	<slot name="remove" />
</Card>

<style>
	.spriteWrapper {
		height: 96px;
		width: 96px;
		margin-left: auto;
		margin-right: auto;
	}

	table {
		width: 100%;
		height: 100%;
	}
	td {
		justify-content: start;
	}

	.types {
		width: 55px;
	}

	p {
		word-wrap: normal;
	}
</style>
