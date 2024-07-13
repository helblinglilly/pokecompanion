<script context="module" lang="ts">
	import Card from '../card';
	import Select from './Select.svelte';

	export const meta = {
		title: 'Atoms/Select',
		component: Select
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
	<Card>
		<Select {...args} on:change={({ detail }) => console.log(detail)} />
	</Card>
</Template>

<Story
	name="Default"
	args={{
		options: [
			{ label: 'Option 1', value: 'option-1' },
			{ label: 'Option 2', value: 'option-2' },
			{ label: 'Option 3', value: 'option-3' }
		],
		defaultValue: 'option-2'
	}}
/>
