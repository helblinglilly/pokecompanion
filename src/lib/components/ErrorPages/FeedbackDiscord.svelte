<script lang="ts">
	import { enhance } from '$app/forms';
	import { addNotification } from '$/features/notifications/notifications';
	import { goto } from '$app/navigation';

	interface Props {
		placeholder?: string;
	}

	let { placeholder = 'What are your thoughts?' }: Props = $props();
	let freetext = $state('');
	let submitting = $state(false);
</script>

<div>
	<form
		method="POST"
		use:enhance={() => {
			submitting = true;
			return async ({ result, update }) => {
				submitting = false;
				if (result.type === 'success') {
					addNotification({ message: 'Got it! Thanks for your input!', level: 'success' });
					freetext = '';
					goto('/');
				} else {
					const error =
						result.type === 'failure' ? result.data?.error : 'Something went wrong, please try again';
					addNotification({ message: String(error), level: 'error' });
					await update({ reset: false });
				}
			};
		}}
	>
		<textarea name="message" bind:value={freetext} {placeholder}></textarea>

		<button class="button" type="submit" disabled={submitting}>
			{submitting ? 'Sending…' : 'Submit Feedback'}
		</button>
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
