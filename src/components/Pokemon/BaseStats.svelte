<script lang="ts">
	import type { Stat } from '$lib/types/IPokemon';
	export let data: Stat[];

	let hp = 0;
	let attack = 0;
	let defense = 0;
	let speed = 0;
	let spAtt = 0;
	let spDef = 0;
	let avg = 0;

	$: {
		hp = data.filter((a) => a.stat.name === 'hp')[0]?.base_stat ?? 0;
		attack = data.filter((a) => a.stat.name === 'attack')[0]?.base_stat ?? 0;
		defense = data.filter((a) => a.stat.name === 'defense')[0]?.base_stat ?? 0;
		speed = data.filter((a) => a.stat.name === 'speed')[0]?.base_stat ?? 0;
		spAtt = data.filter((a) => a.stat.name === 'special-attack')[0]?.base_stat ?? 0;
		spDef = data.filter((a) => a.stat.name === 'special-defense')[0]?.base_stat ?? 0;
		avg = Math.floor((hp + attack + defense + speed + spAtt + spDef) / 6);
	}
</script>

<table>
	<thead>
		<th> Stat </th>
		<td id="statTableHeading">
			<p>0</p>
			<p>70 Average</p>
			<p>220</p>
		</td>
	</thead>
	<tbody>
		<tr>
			<td class="label"><p>HP</p></td>
			<td class="data">
				<p>{hp}</p>
				<div class="wrapper">
					<progress value={hp} max="220" />
					<div class="average-marker" />
				</div>
			</td>
		</tr>
		<tr>
			<td class="label">
				<p class="long">Attack</p>
				<p class="short">A</p>
			</td>
			<td class="data">
				<p>{attack}</p>
				<div class="wrapper">
					<progress value={attack} max="220" />
					<div class="average-marker" />
				</div>
			</td></tr
		>
		<tr>
			<td class="label">
				<p class="long">Defense</p>
				<p class="short">D</p>
			</td>
			<td class="data">
				<p>{defense}</p>
				<div class="wrapper">
					<progress value={defense} max="220" />
					<div class="average-marker" />
				</div>
			</td>
		</tr>
		<tr>
			<td class="label">
				<p class="long">Speed</p>
				<p class="short">S</p>
			</td>
			<td class="data">
				<p>{speed}</p>
				<div class="wrapper">
					<progress value={speed} max="220" />
					<div class="average-marker" />
				</div>
			</td>
		</tr>
		<tr>
			<td class="label">
				<p class="long">Sp Attack</p>
				<p class="short">Sp A</p>
			</td>
			<td class="data">
				<p>{spAtt}</p>
				<div class="wrapper">
					<progress value={spAtt} max="220" />
					<div class="average-marker" />
				</div>
			</td>
		</tr>
		<tr>
			<td class="label">
				<p class="long">Sp Defense</p>
				<p class="short">Sp D</p>
			</td>
			<td class="data">
				<p>{spDef}</p>
				<div class="wrapper">
					<progress value={spDef} max="220" />
					<div class="average-marker" />
				</div>
			</td>
		</tr>
	</tbody>
	<tfoot>
		<tr>
			<td class="label">
				<p class="long"><b>Average</b></p>
				<p class="short"><b>Avg</b></p>
			</td>
			<td class="data">
				<p><b>{avg}</b></p>
				<div class="wrapper">
					<progress value={avg} max="220" />
					<div class="average-marker" />
				</div>
			</td>
		</tr>
	</tfoot>
</table>

<style>
	table {
		width: 100%;
	}
	th {
		text-align: start;
		padding-right: 0.5rem;
		padding-bottom: 0.5rem;
	}
	tr {
		padding-bottom: 0.5rem;
	}
	td {
		padding-bottom: 0.5rem;
	}
	p {
		min-width: fit-content;
	}
	tfoot {
		margin-top: 20px;
	}

	#statTableHeading {
		display: inline-flex;
		width: 100%;
		justify-content: space-between;
	}

	.data {
		width: 100%;
		display: inline-flex;
		gap: 0.5rem;
	}

	.data > p {
		min-width: 2rem;
	}

	.wrapper {
		position: relative;
		display: flex;
		width: 100%;
	}

	.average-marker {
		position: absolute;
		height: 100%;
		width: 2px;
		background-color: var(--text);
		left: 31.8181818182%;
	}

	.short {
		display: none;
	}

	@media (max-width: 387px) {
		.long {
			display: none;
		}
		.short {
			display: inherit;
		}
	}

	progress {
		width: 100%;
		border-radius: 10px;
		background-color: var(--grey-muted);
		color: var(--red-accent);
	}
	progress::-moz-progress-bar {
		background: var(--red-accent);
	}
	progress::-webkit-progress-value {
		background: var(--red-accent);
	}
</style>
