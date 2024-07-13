<script context="module">
	import Card from './Card.svelte';

	export const meta = {
		title: 'Atoms/Card',
		component: Card
	};
</script>

<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
	<!--👇 'on:click' allows to forward event to addon-actions  -->
	<Card {...args}>
		<div style="border: 1px solid red;">
			<p>I am some sample content inside a div with a border!</p>
		</div>
	</Card>
</Template>

<Story name="Default" />

<Story name="Clickable" args={{ isClickable: true }} />
