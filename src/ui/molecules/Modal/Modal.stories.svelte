<script context="module" lang="ts">
	import Modal from '.';
	export const meta = {
		title: 'Molecules/Modal',
		component: Modal
	};
</script>

<script lang="ts">
	import Button from '$/ui/atoms/button/Button.svelte';
	import { Story, Template } from '@storybook/addon-svelte-csf';

	export let showModal = false;
</script>

<Template let:args>
	<Button on:click={() => (showModal = true)}>Show Modal</Button>
	<Modal bind:showModal>
		<h2 class="h2" slot="header">Modal title</h2>
		<p>Hello</p>
	</Modal>
</Template>

<Story name="Default" />
