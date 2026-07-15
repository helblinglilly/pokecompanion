<script>
	import { page } from '$app/state';
	import Feedback from '$/lib/components/ErrorPages/Feedback.svelte';
	import Image from '$/ui/atoms/Image.svelte';
</script>

<Image src="/missingno.png" alt="missingno" classNames="error-sprite" isSprite />

<h2 class="h2">{page.status} - Something went wrong</h2>

<p>{page.error?.message}</p>

<div class="error-detail">
	<p>
		Sorry about that! The details above might give some indication as to what happened. If you think
		that this is a bug, please file an issue in the <a
			href="https://github.com/helblinglilly/pokecompanion">GitHub repo</a
		>
	</p>
</div>
<hr />

<div id="userFeedbackWrapper">
	<h2 class="h2 feedback-heading">Feedback</h2>
	<Feedback placeholder="Would you like to share how you got here?" />
</div>

<style>
	hr {
		margin-top: 2rem;
		margin-bottom: 2rem;
		color: var(--text);
	}

	.error-detail {
		margin-top: var(--space-3);
	}

	.feedback-heading {
		margin-bottom: var(--space-3);
	}

	:global(.error-sprite) {
		margin-right: auto;
		margin-left: auto;
	}
</style>
