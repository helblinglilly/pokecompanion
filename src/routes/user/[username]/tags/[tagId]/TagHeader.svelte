<script lang="ts">
	import Icon from '$/components/UI/Icon.svelte';
	import { currentUser } from '$/lib/stores/user';
	import type { TagRecord } from '$/lib/types/ITags';

	export let tag: TagRecord;
	export let inModifyView: boolean;
</script>

<div>
	<div class="inline-flex gap-2 w-full justify-between">
		<div>
			{#if tag.isPrivate}
				<span class="h-full grid">
					<Icon name="lock" style="margin-top: auto; margin-bottom: auto;" />
				</span>
			{/if}
			<h1 class="h1 pb-0">{tag.name}</h1>
		</div>

		{#if $currentUser?.id === tag.owner}
			<button class="button primary h-full" on:click={() => (inModifyView = !inModifyView)}>
				{#if inModifyView}
					<p>Done</p>
				{:else}
					<p>Edit</p>
				{/if}
			</button>
		{/if}
	</div>
	<p class="md:max-w-lg mt-2">{tag.description.length > 1 ? tag.description : 'No description'}</p>
</div>
