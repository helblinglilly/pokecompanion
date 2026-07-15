<script lang="ts">
	import type { components } from '$/@types/api';
	import Card from '$/ui/atoms/Card.svelte';
	import Image from '$/ui/atoms/Image.svelte';

	interface Props {
		move: components['schemas']['MovePreview'];
		isClickable?: boolean;
		remove?: import('svelte').Snippet;
	}

	let { move, isClickable = true, remove }: Props = $props();
</script>

<Card {isClickable} id={`move-${move.id}`} classes="tag-move-card relative h-auto">
	<div class="spriteWrapper">
		<table>
			<tbody>
				<tr>
					<td class="types">
						<Image
							src={move.damageClass.icon}
							alt={move.damageClass.name}
							classNames="tag-move-icon"
						/>

						<Image
							src={move.type.icon}
							alt={move.type.name}
							classNames="tag-move-icon tag-move-type-icon"
						/>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	{#each move.names as name}
		<p>{name}</p>
	{/each}

	{@render remove?.()}
</Card>

<style>
	:global(.tag-move-card) {
		min-height: 150px;
		padding: 0;
	}

	:global(.tag-move-icon) {
		max-width: 5rem;
		margin-right: auto;
		margin-left: auto;
		object-fit: contain;
	}

	:global(.tag-move-type-icon) {
		margin-bottom: 0.2rem;
	}

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
