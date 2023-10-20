<script lang="ts">
	import Image from '$components/Image.svelte';
	import type { IPublicUser } from '$lib/pb/publicUsers';

	export let user: IPublicUser;
</script>

<div>
	<a class="avatarBackground" href={`/user/${user.username}`}>
		<Image src={user.avatar} alt="Profile Picture" />
	</a>
	<p>{user.username}</p>
</div>

<style>
	.avatarBackground {
		background-color: var(--light_link_hover);
		display: inline-block;
		border-radius: 2rem;
	}
</style>
