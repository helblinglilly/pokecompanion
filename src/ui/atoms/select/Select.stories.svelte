<script context="module" lang="ts">
	import { writable } from 'svelte/store';
	import Select from './Select.svelte';

	export const meta = {
		title: 'Atoms/Select',
		component: Select
	};
</script>

<script lang="ts">
	import { Story } from '@storybook/addon-svelte-csf';

	const selected = writable('option-2');
</script>

<Story name="Default">
	<Select
		options={[
			{ label: 'Option 1', value: 'option-1' },
			{ label: 'Option 2', value: 'option-2' },
			{ label: 'Option 3', value: 'option-3' }
		]}
		bind:value={$selected}
	/>
</Story>
