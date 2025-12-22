<script lang="ts">
	import type { APIPokemonRootPreview } from '$/@types/api.pokecompanion';
	import Button from '$/ui/atoms/button';
	import { goto } from '$app/navigation';

	interface Props {
		pagination: APIPokemonRootPreview['pagination'];
	}

	let { pagination }: Props = $props();

	$effect(() => {
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft' && pagination.currentPage > 1) {
				goto(`/pokemon?page=${pagination.currentPage - 1}`);
			} else if (e.key === 'ArrowRight' && pagination.currentPage < pagination.lastPage) {
				goto(`/pokemon?page=${pagination.currentPage + 1}`);
			}
		};

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div>
	<a href="/pokemon?page=1" class="no-underline" data-sveltekit-reload
		><Button isDisabled={pagination.currentPage === 1}>{'<<'}</Button></a
	>
</div>

<div>
	<a href={`/pokemon?page=${pagination.currentPage - 1}`} class="no-underline" data-sveltekit-reload
		><Button isDisabled={pagination.currentPage === 1}>{'<'}</Button></a
	>
</div>
<div class="grid">
	<p class="break-words">Page</p>
	<p class="break-words">{pagination.currentPage}/{pagination.lastPage}</p>
</div>

<div>
	<a href={`/pokemon?page=${pagination.currentPage + 1}`} class="no-underline" data-sveltekit-reload
		><Button isDisabled={pagination.currentPage === pagination.lastPage}>{'>'}</Button></a
	>
</div>

<div>
	<a href={`/pokemon?page=${pagination.lastPage}`} class="no-underline" data-sveltekit-reload
		><Button isDisabled={pagination.currentPage === pagination.lastPage}>{'>>'}</Button></a
	>
</div>
