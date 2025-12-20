<script>
	let { showModal = $bindable(), header, children } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) {
			dialog.showModal();
			document.body.style.overflow = 'hidden';
		} else {
			dialog?.close();
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog.close();
	}}
>
	<div class="closeWrapper">
		<button class="closeButton" onclick={() => dialog.close()}>X</button>
	</div>

	<div class="contentWrapper">
		{@render header?.()}
		{@render children?.()}
	</div>
</dialog>

<style>
	dialog {
		border-radius: 0.5rem;
	}
	div.contentWrapper {
		padding: 1rem;
	}
	div.closeWrapper {
		position: absolute;
		top: 0;
		right: 0;
	}

	button.closeButton {
		border-bottom-left-radius: 10px;
		background-color: var(--grey-primary);
		width: 2.5rem;
		height: 2.5rem;
	}

	button.closeButton:hover {
		background-color: var(--grey-muted);
	}

	dialog {
		background-color: var(--site-background);
		color: var(--text);
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.8);
	}

	.contentWrapper {
		padding: 0.5rem;
		height: 100%;
	}

	@media screen and (max-width: 768px) {
		dialog {
			min-height: 50%;
			width: 100%;
		}
	}

	@media screen and (min-width: 768px) {
		dialog {
			border-radius: 0.5rem;
			min-width: 16rem;
			min-height: 16rem;
		}
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	dialog {
		overflow: scroll;
	}
</style>
