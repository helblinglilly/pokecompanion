<script lang="ts">
	import PokemonGrouping from '../../components/PokemonGrouping.svelte';
	import PokemonPreview from '../../components/PokemonPreview.svelte';

	const toggleVisibility = (id: string) => {
		const target = document.getElementById(id);
		if (target) {
			target.classList.toggle('hidden');
		}
	};
	export let data;
</script>

<PokemonGrouping pokemons={data.gen1} title="Generation 1" secondaryTitle="#1 - #151" />
<PokemonGrouping pokemons={data.gen2} title="Generation 2" secondaryTitle="#152 - #251" />
<PokemonGrouping pokemons={data.gen3} title="Generation 3" secondaryTitle="#252 - #386" />
<PokemonGrouping pokemons={data.gen4} title="Generation 4" secondaryTitle="#387 - #493" />
<PokemonGrouping pokemons={data.gen5} title="Generation 5" secondaryTitle="#494 - #649" />
<PokemonGrouping pokemons={data.gen6} title="Generation 6" secondaryTitle="#650 - #721" />
<PokemonGrouping pokemons={data.gen7} title="Generation 7" secondaryTitle="#722 - #809" />
<PokemonGrouping pokemons={data.gen8} title="Generation 8" secondaryTitle="#810 - #905" />
<PokemonGrouping pokemons={data.gen9} title="Generation 9" secondaryTitle="#906 - #1010" />
