<script lang="ts">
	import Icon from '$/ui/atoms/Icon.svelte';
	import { currentUser } from '$/lib/stores/user';
	import Button from '$/ui/atoms/Button.svelte';
	import type { APITag } from '$/features/tags/types';

	interface Props {
		entry: Pick<APITag['tags'][number], 'isPrivate' | 'name' | 'owner' | 'description'>;
		inModifyView: boolean;
	}

	let { entry, inModifyView = $bindable() }: Props = $props();
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
				onclick={() => (inModifyView = !inModifyView)}
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
