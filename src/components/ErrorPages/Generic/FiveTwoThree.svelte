<script>
	import Image from '$/ui/atoms/image/Image.svelte';
</script>

<div>
	<Image
		src="/offline.png"
		alt="trading card game of the Chrome Offline Dinosaur"
		style="padding-top: 0; width: 40%; max-width: 300px; min-width: 200px; margin-left: auto; margin-right: auto;"
	/>

	<h2 class="h2" style="padding-top: 2rem;">You are offline</h2>
	<p>A page that you tried to access hasn't been cached yet, and is therefore not able to load</p>
	<br />
	<p>Pages that you already visited should still be available in the meantime</p>
	<br />
	<p>Try going back</p>
</div>

<style>
	div {
		height: fit-content;
	}
</style>
