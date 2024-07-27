<script lang="ts">
	import SocialPreview from '$/components/SocialPreview.svelte';

	export let data;
</script>

<SocialPreview
	title={`${data.teamData.name} - tag`}
	description={`${data.teamData.name} created by ${data.user.username}${
		data.teamData.description ? ` - ${data.teamData.description}` : ''
	}`}
/>

<p>Hello team page</p>

{data.teamData.name}
