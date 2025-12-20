<script lang="ts">
	import { Logger } from '$/debt/log';
	import { goto } from '$app/navigation';
	import { addNotification } from '$lib/stores/notifications';

	interface Props {
		placeholder?: string;
	}

	let { placeholder = 'What are your thoughts?' }: Props = $props();
	let freetext = $state('');

	const onSubmit = async () => {
		Logger.addPageAction('UserFeedback', {
			message: freetext
		});
		addNotification({ message: 'Got it! Thanks for your input!', level: 'success' });
		freetext = '';
		goto('/');
	};
</script>

<div>
	<form onsubmit={onSubmit}>
		<textarea bind:value={freetext} {placeholder}></textarea>

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
