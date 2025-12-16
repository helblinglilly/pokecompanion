<script lang="ts">
	import type { paths } from '$/@types/api';
	import Card from '$/ui/atoms/card';
	import Image from '$/ui/atoms/image/Image.svelte';

	export let move: paths['/search/moves']['get']['responses']['200']['content']['application/json']['data'][number];
</script>

<Card
	id={`move-${move.id}`}
	style={`position: relative;`}
	classes={`m-0 w-full flex p-8 h-28`}
	isClickable
>
	<table>
		<tr>
			<td>
				<Image
					src={move.damageClass.icon}
					alt={move.damageClass.name}
					style={'max-width: 5rem; object-fit: contain;'}
				/>
			</td>
		</tr>
		<tr>
			<td>
				<Image
					src={move.type.icon}
					alt={move.type.name}
					style={'max-width: 5rem; object-fit: contain;'}
				/>
			</td>
		</tr>
	</table>

	<span class="ml-4">
		<p>{move.name}</p>
	</span>

	<slot name="remove" />
</Card>

<style>
	span {
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
