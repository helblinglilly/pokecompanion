<script lang="ts">
	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
	$: if (dialog && !showModal) dialog.close();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="dialogWrapper">
		<div class="header">
			<div class="closeWrapper">
				<button class="closeButton" on:click={() => dialog.close()}>X</button>
			</div>

			<div class="titleWrapper">
				<slot name="header" />
			</div>
		</div>

		<div class="contentWrapper">
			<slot />
		</div>
	</div>
</dialog>

<style>
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
		background: rgba(0, 0, 0, 0.7);
	}

	.header {
		padding-left: 0.5rem;
		height: 4rem;
		justify-items: center;
		border-bottom: 1px solid var(--text);
	}

	.titleWrapper {
		height: 100%;
		display: grid;
		align-content: center;
	}

	.contentWrapper {
		padding: 0.5rem;
		height: 100%;
	}

	@media screen and (max-width: 768px) {
		dialog {
			height: 100%;
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
</style>
