<script lang="ts">
	import { onMount } from 'svelte';

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
	id="backToTop"
	class:show={scrolled}
	class={`${!scrolled ? 'hidden' : ''}`}
	on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button
>
