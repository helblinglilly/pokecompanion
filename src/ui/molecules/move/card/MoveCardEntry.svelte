<script lang="ts">
	import type { components } from '$/@types/api';
	import Card from '$/ui/atoms/card';
	import Image from '$/ui/atoms/Image.svelte';

	interface Props {
		move: components['schemas']['MovePreview'];
		isClickable?: boolean;
		remove?: import('svelte').Snippet;
	}

	let { move, isClickable = true, remove }: Props = $props();
</script>

<Card
	{isClickable}
	id={`move-${move.id}`}
	classes="relative h-auto"
	style={` min-height: 150px; padding: 0;`}
>
	<div class="spriteWrapper">
		<table>
			<tbody>
				<tr>
					<td class="types">
						<Image
							src={move.damageClass.icon}
							alt={move.damageClass.name}
							style={'max-width: 5rem; object-fit: contain; margin-left: auto; margin-right: auto;'}
						/>

						<Image
							src={move.type.icon}
							alt={move.type.name}
							style={'max-width: 5rem; object-fit: contain; margin-bottom: 0.2rem; margin-left: auto; margin-right: auto;'}
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
