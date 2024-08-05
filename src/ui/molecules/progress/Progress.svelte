<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import type { IProgress } from './types';

	const dispatch = createEventDispatcher();

	export let steps = writable<IProgress[]>([]);

	steps.subscribe((newSteps) => {
		console.log(newSteps);
	});
</script>

<div class="progress-container">
	{#each $steps as step, index}
		<button
			class="step"
			disabled={Boolean(step.disabled)}
			on:click={() => {
				if (step.disabled || step.active) {
					return;
				}
				dispatch('progressOption', index);
			}}
		>
			<div class={`circle ${step.disabled ? ' disabled' : step.active ? ' active' : ''}`}>
				{index + 1}
			</div>
			<div class="label">{step.label}</div>
		</button>
	{/each}
</div>

<style>
	.progress-container {
		display: flex;
		width: 100%;
		justify-content: space-evenly;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.circle {
		background-color: var(--grey-primary-light);
		border-radius: 100%;
		width: 2rem;
		height: 2rem;
		text-align: center;
		align-content: center;
		border: 3px solid var(--text-inverse);
		color: var(--text-inverse-dark);
	}

	.circle.active {
		background-color: var(--red-accent);
		color: var(--text-inverse-light);
	}

	.circle.disabled {
		background-color: var(--card-hover);
		color: var(--text-inverse-light);
	}
</style>
