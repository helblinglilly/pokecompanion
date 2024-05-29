<script lang="ts">
	export let src: string;
	export let alt: string;
	export let height: string | undefined = 'inherit';
	export let width: string | undefined = 'inherit';
	export let style: string | undefined = undefined;
	export let classNames: string | undefined = undefined;
	export let id: string | undefined = `image-${src}-${alt}`;
	export let loading: 'eager' | 'lazy' = 'lazy';
	export let fallback: string = '';

	if (!src) {
		src = '/placeholder.png';
	}

	let hasFallenBack = fallback === '' ? true : false;
</script>

<img
	src={src ? src : fallback !== '' ? fallback : '/placeholder.png'}
	{alt}
	{height}
	{width}
	{style}
	{id}
	class={classNames}
	{loading}
	on:error={(e) => {
		if (e.target) {
			if (!hasFallenBack) {
				//@ts-ignore
				e.target.src = fallback;
				hasFallenBack = true;
			} else {
				//@ts-ignore
				e.target.src = '/placeholder.png';
			}
		}
	}}
/>
