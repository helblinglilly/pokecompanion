<script lang="ts">
	export let src: string;
	export let alt: string;
	export let height: string | undefined = 'inherit';
	export let width: string | undefined = 'inherit';
	export let style: string | undefined = undefined;
	export let classNames: string | undefined = undefined;
	export let id: string | undefined = `image-${src}-${alt}`;
	export let loading: 'eager' | 'lazy' = 'lazy';
	export let fallback = '';

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
	class={`${classNames} text-textColour`}
	{loading}
	on:error={(e) => {
		if (e.target) {
			if ('src' in e.target) {
				if (!hasFallenBack) {
					e.target.src = fallback;
					hasFallenBack = true;
				} else {
					e.target.src = '/placeholder.png';
				}
			}
		}
	}}
/>
