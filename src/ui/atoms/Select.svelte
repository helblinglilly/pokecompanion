<script lang="ts">
	interface Props {
		options?: { label: string; value: string; disabled?: boolean }[];
		value?: string;
		style?: string;
		defaultValue?: string;
		isNested?: boolean;
		name?: string;
		onchange?: (value: string) => void;
		oninput?: (value: string) => void;
		[key: string]: any;
	}

	let {
		options = [],
		value = $bindable(''),
		style = '',
		defaultValue = '',
		isNested = false,
		name = '',
		onchange,
		oninput,
		...rest
	}: Props = $props();

	function triggerOnChange(event: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		const eventTarget = event.target as HTMLInputElement;

		if (eventTarget?.value) {
			onchange?.(eventTarget.value);
			oninput?.(eventTarget.value);
		}
	}
</script>

<select
	{name}
	class={`select${isNested ? ' nested' : ''}`}
	{style}
	bind:value
	onchange={(e) => {
		triggerOnChange(e);
	}}
	{...rest}
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
