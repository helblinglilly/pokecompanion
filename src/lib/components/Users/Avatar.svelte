<script lang="ts">
	import Image from '$/ui/atoms/image/Image.svelte';
	import type { IPublicUser } from '$lib/pb/publicUsers';

	export let user: IPublicUser;
</script>

<a class="avatarBackground" href={`/user/${user.username}`}>
	<Image src={user.avatar} alt="Profile Picture" />
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
