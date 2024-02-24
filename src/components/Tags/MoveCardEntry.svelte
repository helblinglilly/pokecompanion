<script lang="ts">
	import Image from '$components/UI/Image.svelte';
	import { primaryLanguage, secondaryLanguage, selectedGame } from '$lib/stores/domain';
	import { getMove, type IMove } from '$lib/types/IMoves';
	import { getNameEntry } from '$lib/utils/language';
	import { onMount } from 'svelte';

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
								<Image
									src={`/icons/types/${move.type.name}.webp`}
									alt={move.type.name}
									height={'20px'}
									style="margin-bottom: 0.2rem; margin-left: auto; margin-right: auto;"
								/>
								<Image
									src={`/icons/types/damage/${move.damage_class.name}.png`}
									alt={move.damage_class.name}
									width={'50px'}
									height={'20px'}
									style="margin-left: auto; margin-right: auto;"
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<p>
				{primaryName}{secondaryName && primaryName !== secondaryName ? ` - ${secondaryName}` : ''}
			</p>
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
		text-decoration-line: unset;
		border-radius: 10px;
		display: block;
		height: 100%;
		padding: 2rem;
	}

	a > p {
		text-align: center;
		position: relative;
	}

	.card {
		position: relative;
		margin: 1rem;
		text-decoration: none;
		padding: 0;
		max-width: 20%;
		height: auto;
		min-width: 150px;
	}

	.spriteWrapper {
		height: 96px;
		width: 96px;
		margin-left: auto;
		margin-right: auto;
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
		z-index: 1;
	}

	@media screen and (min-width: 768px) {
		.card {
			max-width: 45%;
		}
	}
</style>
