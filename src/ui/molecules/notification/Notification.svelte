<script lang="ts">
	import { removeNotification, type INotification } from '$/lib/stores/notifications';

	export let notification: INotification;
</script>

<div class={`notification notification--${notification.level}`}>
	{notification.message}

	<button
		class="remove-button"
		on:click={() => {
			removeNotification(notification);
		}}
	>
		x
	</button>
</div>

<style>
	.notification {
		position: relative;
		padding: 2rem;
		border-radius: 0.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		color: var(--text-dark);
	}

	.notification--failure {
		background-color: var(--error);
	}

	.notification--success {
		background-color: var(--success);
	}

	.notification--info {
		background-color: var(--info);
	}

	.remove-button {
		position: absolute;
		top: 0;
		right: 0;

		border-bottom-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;

		height: 2.5rem;
		width: 2.5rem;

		background-color: var(--grey-muted);
		color: var(--text-light);
	}
</style>
