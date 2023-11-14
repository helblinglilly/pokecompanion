<script lang="ts">
	export let buttonConfig: {
		text: string;
		class?: string;
		type?: 'button' | 'submit' | 'reset' | undefined;
		onClick?: () => void;
	};
	export let inputConfig: {
		style?: string | undefined;
		placeholder?: string | undefined;
	};
	export let variation: 'small' | 'regular';
	export let containerStyling: string = '';
	export let valueBinding: string;
</script>

<div style={containerStyling ?? ''}>
	<input
		type="text"
		style={`${variation === 'regular' ? 'padding: 2rem;' : ''} ${inputConfig.style}`}
		bind:value={valueBinding}
		placeholder={inputConfig.placeholder ?? ''}
	/>
	<button
		class={`button ${buttonConfig.class ?? ''}`}
		type={buttonConfig.type ?? 'button'}
		style={`${
			variation === 'small' ? 'padding: 5px;' : ''
		} border-top-left-radius: 0; border-bottom-left-radius: 0;`}
		on:click={buttonConfig.onClick}>{buttonConfig.text}</button
	>
</div>

<style>
	div {
		display: flex;
	}
	input[type='text'] {
		flex: 1;
		width: 100%;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
</style>
