<script lang="ts">
	import Image from '$components/UI/Image.svelte';
	import { Logger } from '$lib/log';
	import { primaryLanguage, secondaryLanguage } from '$lib/stores/domain';
	import { getNameEntry } from '$lib/utils/language';
	import type { IPokemonMinimalMove } from '../../routes/api/pokemon/types';

	export let move: IPokemonMinimalMove;

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
							<Image
								src={`/icons/types/${move.type.name}.webp`}
								alt={move.type.name}
								height={'20px'}
								style="margin-bottom: 0.2rem;"
							/>
							<Image
								src={`/icons/types/damage/${move.damage_class.name}.png`}
								alt={move.damage_class.name}
								width={'50px'}
								height={'20px'}
							/>
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
