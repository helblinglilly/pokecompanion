<script lang="ts">
	import { logToAxiom } from '$lib/log';

	export let placeholder: string = 'What are your thoughts?';
	let freetext: string = '';

	const onSubmit = () => {
		logToAxiom({
			action: 'userFeedback',
			text: freetext
		});
	};
</script>

<form on:submit={onSubmit}>
	<textarea bind:value={freetext} {placeholder} />

	<button class="button" type="submit">Submit Feedback</button>
</form>
