<script lang="ts">
	import Image from '$/components/UI/Image.svelte';
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { getMove, type IMove } from '$lib/types/IMoves';
	import { getNameEntry } from '$lib/utils/language';
	import { onMount } from 'svelte';
	import Type from '../Type.svelte';

	export let id: number;
	let move: IMove | undefined;

	export let showRemoveButton: boolean;
	export let onRemoveClick: () => void = () => null;

	onMount(async () => {
		move = await getMove(id, $selectedGame);
	});

	$: primaryName = move ? getNameEntry(move.names, $primaryLanguage) : undefined;
	$: secondaryName =
		move && $secondaryLanguage ? getNameEntry(move.names, $secondaryLanguage) : undefined;
</script>

<div class="card clickable" id={`move-${id}`}>
	<a href={`/move/${id}`}>
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

								<Type
									type={move.damage_class.name}
									style="margin-left: auto; margin-right: auto;"
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<span>
				<p>{primaryName}</p>
				{#if secondaryName && primaryName !== secondaryName}
					<p>{secondaryName}</p>
				{/if}
			</span>
		{:else}
			<p>Loading...</p>
		{/if}
	</a>

	{#if showRemoveButton}
		<button class="removeButton" on:click={onRemoveClick}>-</button>
	{/if}
</div>

<style>
	a {
		text-decoration: none;
		width: 100%;
		height: 100%;
		display: flex;
	}

	.card {
		position: relative;
		padding: 0.25rem;
		margin: 1rem;
	}

	.spriteWrapper {
		height: 96px;
		width: 96px;
		padding: 1rem;
	}

	a:hover {
		cursor: pointer;
		background-color: var(--primary);
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

	@media screen and (min-width: 768px) {
		.card {
			max-width: 45%;
		}
	}
</style>
