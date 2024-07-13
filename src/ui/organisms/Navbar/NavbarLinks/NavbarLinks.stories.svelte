<script context="module" lang="ts">
	import NavbarLinks from './NavbarLinks.svelte';
	export const meta = {
		title: 'Organisms/Navbar/NavbarLinks',
		component: NavbarLinks
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
	<NavbarLinks {...args} />
</Template>

<Story name="Default" />
