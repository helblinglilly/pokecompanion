<script lang="ts">
	import { enhance } from '$app/forms';
	import { addNotification } from '$/features/notifications/notifications';
	import Button from '$/ui/atoms/Button.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		placeholder?: string;
	}

	const maxLength = 2000;
	const textareaId = 'feedback-message';

	let { placeholder = 'What are your thoughts?' }: Props = $props();
	let freetext = $state('');
	let submitting = $state(false);
	let remainingCharacters = $derived(maxLength - freetext.length);
</script>

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
				addNotification({ message: String(error), level: 'failure' });
				await update({ reset: false });
			}
		};
	}}
>
	<p>Please leave any feedback below.</p>

	<label for={textareaId}>Your message</label>
	<textarea id={textareaId} name="message" maxlength={maxLength} bind:value={freetext} {placeholder}
	></textarea>
	<p class="character-count">{remainingCharacters} characters left</p>

	<Button variant="accent" type="submit" isDisabled={submitting || !freetext.trim()}>
		{submitting ? 'Sending…' : 'Submit Feedback'}
	</Button>
</form>

<style>
	form {
		display: grid;
		gap: 1rem;
	}

	label {
		font-weight: 700;
	}

	textarea {
		width: 100%;
		min-height: 10rem;
		background-color: white;
	}

	.character-count {
		margin-top: -0.5rem;
		font-size: 0.85rem;
		opacity: 0.7;
	}
</style>
