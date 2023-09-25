<script lang="ts">
	export let src: string;
	export let alt: string;
	export let height: string | undefined = undefined;
	export let width: string | undefined = undefined;
	export let style: string | undefined = undefined;
	export let classNames: string | undefined = undefined;
	export let id: string | undefined = `image-${src}-${alt}`;
	export let loading: 'eager' | 'lazy' = 'lazy';

	if (!src) {
		src = '/placeholder.png';
	}
</script>

<img
	src={src ?? '/placeholder.png'}
	{alt}
	{height}
	{width}
	{style}
	{id}
	class={classNames}
	{loading}
	on:error={(e) => {
		if (e.target) {
			//@ts-ignore
			e.target.src = '/placeholder.png';
		}
	}}
/>
