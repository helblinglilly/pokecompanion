<script context="module">
	import Card from './Card.svelte';

	export const meta = {
		title: 'Atoms/Card',
		component: Card
	};

	const sampleText =
		'I am a paragraph that sits within this card and is looking... well I mean you can see for yourself!';
</script>

<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Story name="Default">
	<Card>
		<p>
			{sampleText}
		</p>
	</Card>
</Story>

<Story name="Clickable">
	<Card isClickable>
		<p>
			{sampleText}
		</p>
	</Card>
</Story>
