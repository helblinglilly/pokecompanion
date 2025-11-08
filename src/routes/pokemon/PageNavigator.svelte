<script lang="ts">
	import type { APIPokemonRootPreview } from '$/@types/api.pokecompanion';
	import Button from '$/ui/atoms/button';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let pagination: APIPokemonRootPreview['pagination'];

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft' && pagination.currentPage > 1) {
				goto(`/pokemon?page=${pagination.currentPage - 1}`);
			} else if (e.key === 'ArrowRight' && pagination.currentPage < pagination.lastPage) {
				goto(`/pokemon?page=${pagination.currentPage + 1}`);
			}
		});
	});
</script>

<div>
	<a href="/pokemon?page=1" class="no-underline"
		><Button isDisabled={pagination.currentPage === 1}>{'<<'}</Button></a
	>
</div>

<div>
	<a href={`/pokemon?page=${pagination.currentPage - 1}`} class="no-underline"
		><Button isDisabled={pagination.currentPage === 1}>{'<'}</Button></a
	>
</div>
<div class="grid">
	<p class="break-words">Page</p>
	<p class="break-words">{pagination.currentPage}/{pagination.lastPage}</p>
</div>

<div>
	<a href={`/pokemon?page=${pagination.currentPage + 1}`} class="no-underline"
		><Button isDisabled={pagination.currentPage === pagination.lastPage}>{'>'}</Button></a
	>
</div>

<div>
	<a href={`/pokemon?page=${pagination.lastPage}`} class="no-underline"
		><Button isDisabled={pagination.currentPage === pagination.lastPage}>{'>>'}</Button></a
	>
</div>
