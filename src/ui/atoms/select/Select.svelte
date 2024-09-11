<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let options: { label: string; value: string; disabled?: boolean }[] = [];
	export let value = '';
	export let style = '';
	export let defaultValue = '';
	export let isNested = false;
	export let name = '';

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
	{name}
	class={`select${isNested ? ' nested' : ''}`}
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
		border-radius: 0.5rem;
		max-width: 24rem;
		appearance: none;
		background-color: var(--grey-primary);
		color: var(--text);

		cursor: pointer;
	}

	.select.nested {
		background-color: var(--select-background);
	}

	.select:hover {
		background-color: var(--grey-muted);
	}
</style>
