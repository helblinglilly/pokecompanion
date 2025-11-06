<script lang="ts">
	import Image from '$/ui/atoms/image/Image.svelte';

	export let username: string;
</script>

<a class="avatarBackground" href={`/user/${username}`}>
	<Image src={`https://avatar.helbling.uk/${username}`} alt="Profile Picture" />
</a>

<style>
	.avatarBackground {
		background-color: var(--site-background-dark);
		display: inline-block;
		border-radius: 2rem;
		margin-right: 1rem;
		margin-left: 1rem;
		width: fit-content;
		height: fit-content;
	}
</style>
