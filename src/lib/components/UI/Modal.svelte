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
	<div on:click|stopPropagation>
		<div
			style="width: 100%; justify-content: position: sticky; top: 0; background-color: var(--primary); padding-top: 1rem; border-bottom: 2px solid var(--text);"
		>
			<div style="position: absolute; top: 0; right: 0;">
				<button on:click={() => dialog.close()}>X</button>
			</div>
			<slot name="header" />
		</div>
		<slot />
	</div>
</dialog>

<style>
	dialog {
		max-width: 32rem;
		border-radius: 10px;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.6);
	}
	dialog > div {
		padding: 1em;
		background-color: var(--primary);
		color: var(--text);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	button {
		border-bottom-left-radius: 10px;
		background-color: var(--accent);
		width: 2.5rem;
		height: 2.5rem;
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
