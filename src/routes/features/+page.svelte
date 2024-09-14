<script lang="ts">
	import { featureFlags, type FeatureFlags } from '$/lib/stores/domain';
	import Card from '$/ui/atoms/card/Card.svelte';

	type FeatureFlagName = keyof FeatureFlags;

	$: featureFlagNames = Object.keys($featureFlags) as FeatureFlagName[];
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<Card>
	<h1 class="h2">Feature Flags</h1>

	<div class="grid gap-4">
		{#each featureFlagNames as featureFlagName}
			<div class="inline-flex">
				<input
					on:change={() => {
						featureFlags.set({
							...$featureFlags,
							[featureFlagName]: !$featureFlags[featureFlagName]
						});
					}}
					type="checkbox"
					name={featureFlagName}
					id={featureFlagName}
					checked={$featureFlags[featureFlagName]}
				/>

				<label for={featureFlagName}>{featureFlagName}</label>
			</div>
		{/each}
	</div>
</Card>
