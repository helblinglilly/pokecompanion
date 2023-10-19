<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import Image from '$components/Image.svelte';
</script>

<div class="columns">
	<div class="column">
		<div class="card">
			{#if $currentUser.avatar}
				<Image src={$currentUser.avatar} alt="Profile Picture" />
			{:else}
				<p>{JSON.stringify($currentUser)}</p>
			{/if}

			<!-- <Image src={$currentUser.avatar} alt="Profile Picture" /> -->
		</div>
	</div>
</div>
