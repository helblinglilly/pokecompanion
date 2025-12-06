<script lang="ts">
	import type { paths } from '$/@types/api';
	import Card from '$/ui/atoms/card';

	export let move: paths['/search/moves']['get']['responses']['200']['content']['application/json']['data'][number];
</script>

<Card
	id={`move-${move.id}`}
	style={`position: relative;`}
	classes="m-0 w-full w-full h-full flex p-8 h-28"
	isClickable
>
	<div />

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
