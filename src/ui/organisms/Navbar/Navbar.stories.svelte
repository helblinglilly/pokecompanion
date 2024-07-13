<script context="module" lang="ts">
	import Navbar from './Navbar.svelte';

	export const meta = {
		title: 'Organisms/Navbar',
		component: Navbar
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
	<Navbar {...args} />
</Template>

<Story name="Default" />
