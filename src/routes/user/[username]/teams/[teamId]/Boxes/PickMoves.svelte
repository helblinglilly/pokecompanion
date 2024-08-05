<script lang="ts">
	import type { IBasePokemon } from '$/lib/types/ITeams';
	import type { Writable } from 'svelte/store';

	export let pokemon: Writable<IBasePokemon>;
</script>

<p>Moves</p>
