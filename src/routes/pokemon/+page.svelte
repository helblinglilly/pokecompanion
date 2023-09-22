<script lang="ts">
	import { onMount } from 'svelte';
	import PokemonGrouping from '../../components/PokemonGrouping.svelte';
	export let data;

	$: areAllHidden = false;

	let scrolled = false;
	onMount(() => {
		window.addEventListener('scroll', () => {
			if (window.scrollY >= window.innerHeight) {
				scrolled = true;
			} else {
				scrolled = false;
			}
		});
	});
</script>

<button
	class="button"
	on:click={() => {
		areAllHidden = !areAllHidden;
	}}>Collapse all</button
>

<button
	id="backToTop"
	class:show={scrolled}
	class={`${!scrolled ? 'hidden' : ''}`}
	on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button
>

<PokemonGrouping
	pokemons={data.gen1}
	isHidden={areAllHidden}
	title="Generation 1"
	secondaryTitle="#1 - #151"
/>
<PokemonGrouping
	pokemons={data.gen2}
	isHidden={areAllHidden}
	title="Generation 2"
	secondaryTitle="#152 - #251"
/>
<PokemonGrouping
	pokemons={data.gen3}
	isHidden={areAllHidden}
	title="Generation 3"
	secondaryTitle="#252 - #386"
/>
<PokemonGrouping
	pokemons={data.gen4}
	isHidden={areAllHidden}
	title="Generation 4"
	secondaryTitle="#387 - #493"
/>
<PokemonGrouping
	pokemons={data.gen5}
	isHidden={areAllHidden}
	title="Generation 5"
	secondaryTitle="#494 - #649"
/>
<PokemonGrouping
	pokemons={data.gen6}
	isHidden={areAllHidden}
	title="Generation 6"
	secondaryTitle="#650 - #721"
/>
<PokemonGrouping
	pokemons={data.gen7}
	isHidden={areAllHidden}
	title="Generation 7"
	secondaryTitle="#722 - #809"
/>
<PokemonGrouping
	pokemons={data.gen8}
	isHidden={areAllHidden}
	title="Generation 8"
	secondaryTitle="#810 - #905"
/>
<PokemonGrouping
	pokemons={data.gen9}
	isHidden={areAllHidden}
	title="Generation 9"
	secondaryTitle="#906 - #1017"
/>
