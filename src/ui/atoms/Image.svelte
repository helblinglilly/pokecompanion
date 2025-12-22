<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		height?: string | undefined;
		width?: string | undefined;
		style?: string | undefined;
		classNames?: string | undefined;
		id?: string | undefined;
		loading?: 'eager' | 'lazy';
		fallback?: string;
	}

	let {
		src = $bindable(),
		alt,
		height = 'inherit',
		width = 'inherit',
		style = undefined,
		classNames = undefined,
		id = `image-${src}-${alt}`,
		loading = 'lazy',
		fallback = ''
	}: Props = $props();

	if (!src) {
		src = '/placeholder.png';
	}

	let hasFallenBack = $derived(fallback === '' ? true : false);
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
	onerror={(e) => {
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
