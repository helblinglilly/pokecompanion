<script lang="ts">
	import type { Stat } from '$lib/types/IPokemon';
	export let data: Stat[];

	const hp = data.filter((a) => a.stat.name === 'hp')[0].base_stat;
	const attack = data.filter((a) => a.stat.name === 'attack')[0].base_stat;
	const defense = data.filter((a) => a.stat.name === 'defense')[0].base_stat;
	const speed = data.filter((a) => a.stat.name === 'speed')[0].base_stat;
	const spAtt = data.filter((a) => a.stat.name === 'special-attack')[0].base_stat;
	const spDef = data.filter((a) => a.stat.name === 'special-defense')[0].base_stat;
</script>

<table>
	<thead>
		<th> HP </th>
		<th>Attack</th>
		<th>Defense</th>
		<th>Sp Attack</th>
		<th>Sp Defense</th>
		<th>Speed</th>
	</thead>
	<tbody>
		<tr>
			<td><p>{hp}</p></td>
			<td><p>{attack}</p></td>
			<td><p>{defense}</p></td>
			<td><p>{speed}</p></td>
			<td><p>{spAtt}</p></td>
			<td><p>{spDef}</p></td>
		</tr>
	</tbody>
</table>

<style>
	table {
		width: 100%;
	}
	th {
		min-height: 400px;
		/* height: 6rem; */
		transform: rotate(-90deg);
	}
	p {
		width: 100%;
		margin-left: auto;
		margin-right: auto;
		text-align: center;
	}
</style>
