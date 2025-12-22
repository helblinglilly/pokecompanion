<script lang="ts">
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import Button from '$/ui/atoms/Button.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	function replaceQueryParam(name: string, value: string) {
		const newSearchParams = new URLSearchParams(page.url.searchParams);
		newSearchParams.set(name, value);
		goto(`?${newSearchParams}`, { replaceState: true, noScroll: true });
	}
</script>

<Button
	onclick={() => {
		const newViewState = page.url.searchParams.get('view') === 'card' ? 'list' : 'card';
		replaceQueryParam('view', newViewState);
	}}
	classes="inline-flex align-middle gap-2 w-56 md:pr-8"
>
	{#if page.url.searchParams.get('view') === 'card'}
		<Icon name="list" style="margin-top: auto; margin-bottom: auto;" />
		<p>View as List</p>
	{:else}
		<Icon name="card" style="margin-top: auto; margin-bottom: auto;" />
		<p>View as Card</p>
	{/if}
</Button>
