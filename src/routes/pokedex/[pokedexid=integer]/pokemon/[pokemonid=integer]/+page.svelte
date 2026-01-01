<script lang="ts">
	import Navigator from '$/features/pokedex/pokemon/Navigator.svelte';

	let { data } = $props();
	const navigation = $derived(data.pokedex.navigation);
</script>

<Navigator previous={navigation.previous} current={navigation.current} next={navigation.next} />
