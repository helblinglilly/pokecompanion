<script lang="ts">
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import { currentUser } from '$/lib/stores/user';
	import type { RecordTag } from '$/routes/api/tag/types';
	import Button from '$/ui/atoms/button/Button.svelte';

	export let entry: Pick<RecordTag, 'isPrivate' | 'name' | 'owner' | 'description'>;
	export let inModifyView: boolean;
</script>

<div>
	<div class="inline-flex gap-2 w-full justify-between">
		<div class="inline-flex justify-center gap-2">
			{#if entry.isPrivate}
				<Icon name="lock" style="margin-top: auto; margin-bottom: auto;" />
			{/if}
			<h1 class="h1 pb-0">{entry.name}</h1>
		</div>

		{#if $currentUser?.id === entry.owner}
			<Button
				variant={inModifyView ? 'primary' : 'secondary'}
				classes="h-full"
				on:click={() => (inModifyView = !inModifyView)}
			>
				{#if inModifyView}
					<p>Done</p>
				{:else}
					<p>Edit</p>
				{/if}
			</Button>
		{/if}
	</div>
	<p class="md:max-w-lg my-4 text-left">
		{entry.description.length > 1 ? entry.description : 'No description'}
	</p>
</div>
