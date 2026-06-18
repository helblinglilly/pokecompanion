<script lang="ts">
	import { Logger } from '$/debt/log';
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
	let remainingCharacters = $derived(maxLength - freetext.length);

	const onSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const message = freetext.trim();

		if (!message) {
			return;
		}

		Logger.addPageAction('UserFeedback', {
			message
		});
		addNotification({ message: 'Got it! Thanks for your input!', level: 'success' });
		freetext = '';
		goto('/');
	};
</script>

<form onsubmit={onSubmit}>
	<p>Please leave any feedback below.</p>

	<label for={textareaId}>Your message</label>
	<textarea id={textareaId} maxlength={maxLength} bind:value={freetext} {placeholder}></textarea>
	<p class="character-count">{remainingCharacters} characters left</p>

	<Button variant="accent" type="submit" isDisabled={!freetext.trim()}>Submit Feedback</Button>
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
