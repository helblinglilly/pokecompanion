<script lang="ts">
	import Button from '$/ui/atoms/button/Button.svelte';
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

<div class={`${!scrolled ? 'hidden' : ''}`}>
	<Button variant="accent" on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
		Back to top
	</Button>
</div>

<style>
	div {
		position: fixed;
		bottom: 20px;
		right: 20px;
		color: var(--text);
		padding: 10px 15px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		z-index: 1000;
	}
</style>
