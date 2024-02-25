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

<div>
	<form on:submit={onSubmit}>
		<textarea bind:value={freetext} {placeholder} />

		<button class="button" type="submit">Submit Feedback</button>
	</form>
</div>

<style>
	form {
		display: grid;
	}
	textarea {
		width: 100%;
		min-height: 6rem;
		padding: 1rem;
		border-radius: 0.2rem;
	}
	button {
		width: 100%;
		margin-top: 1rem;
	}
</style>
