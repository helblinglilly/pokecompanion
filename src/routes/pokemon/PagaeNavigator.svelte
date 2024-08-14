<script lang="ts">
	import { pokemonPageSize } from '$/lib/stores/domain';
	import Button from '$/ui/atoms/button';
	import { page } from '$app/stores';
	import PokemonNames from '$lib/data/pokemonNames.json';

	const numberOfPages = Math.ceil(PokemonNames.length / pokemonPageSize);

	$: pageNumber = () => {
		const searchParamsPage = Number($page.url.searchParams.get('page'));
		if (searchParamsPage && searchParamsPage <= numberOfPages && searchParamsPage >= 1) {
			return searchParamsPage;
		}
		return 1;
	};
</script>

<div>
	<a href="/pokemon?page=1" class="no-underline"><Button>{'<<'}</Button></a>
</div>

<div>
	<a href={`/pokemon?page=${pageNumber() - 1}`} class="no-underline"><Button>{'<'}</Button></a>
</div>
<div class="grid">
	<p class="break-words">Page</p>
	<p class="break-words">{pageNumber()}/{numberOfPages}</p>
</div>

<div>
	<a href={`/pokemon?page=${pageNumber() + 1}`} class="no-underline"><Button>{'>'}</Button></a>
</div>

<div>
	<a href={`/pokemon?page=${numberOfPages}`} class="no-underline"><Button>{'>>'}</Button></a>
</div>
