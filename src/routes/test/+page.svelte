<script>
	import { page } from '$app/stores';
	export let data;
</script>

<h1>{JSON.stringify(data)}</h1>
<ul />

<a href="/">Home</a>

<p>{$page.data.theme}</p>
