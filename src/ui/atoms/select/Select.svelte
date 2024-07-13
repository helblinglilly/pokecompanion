<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let options: { label: string; value: string; disabled?: boolean }[] = [];
	export let value: string = '';
	export let style: string = '';
	export let defaultValue: string = '';

	const dispatch = createEventDispatcher();

	function triggerOnChange(event: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		const eventTarget = event.target as HTMLInputElement;

		if (eventTarget?.value) {
			dispatch('change', eventTarget.value);
			dispatch('input', eventTarget.value);
		}
	}
</script>

<select
	class="select"
	{style}
	bind:value
	on:change={(e) => {
		triggerOnChange(e);
	}}
>
	{#each options as option}
		<option
			value={option.value}
			selected={option.value === defaultValue}
			disabled={option.disabled}
		>
			{option.label}
		</option>
	{/each}
</select>

<style>
	.select {
		margin-top: 1rem;
		margin-bottom: 1rem;
		margin-right: 1rem;
		padding-left: 1rem;
		height: 50px;
		width: 100%;
		border-radius: 0.25rem;
		max-width: 24rem;
		appearance: none;

		background-color: var(--select-background);
		color: var(--text);
	}
</style>
