<script lang="ts">
	export let buttonConfig: {
		text: string;
		class?: string;
		type?: 'button' | 'submit' | 'reset' | undefined;
		onClick?: () => void;
	};
	export let inputConfig: {
		valueBind: string;
		placeholder?: string | undefined;
	};
	export let variation: 'small' | 'regular';
	export let containerStyling: string = '';
</script>

{#if variation === 'regular'}
	<div style={containerStyling ?? ''}>
		<input
			type="text"
			style="padding: 2rem;"
			bind:value={inputConfig.valueBind}
			placeholder={inputConfig.placeholder ?? ''}
		/>
		<button
			class={`button ${buttonConfig.class ?? ''}`}
			type={buttonConfig.type ?? 'button'}
			on:click={buttonConfig.onClick}>{buttonConfig.text}</button
		>
	</div>
{:else}
	<div style={containerStyling ?? ''}>
		<input
			type="text"
			bind:value={inputConfig.valueBind}
			placeholder={inputConfig.placeholder ?? ''}
		/>
		<button
			class={`button ${buttonConfig.class ?? ''}`}
			type={buttonConfig.type ?? 'button'}
			style="padding: 5px;"
			on:click={buttonConfig.onClick}
			>{buttonConfig.text}
		</button>
	</div>
{/if}

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
	button {
		min-width: fit-content;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
</style>
