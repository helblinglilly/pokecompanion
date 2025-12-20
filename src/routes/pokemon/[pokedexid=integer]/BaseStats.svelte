<script lang="ts">
	import type { APIPokemon } from '$/@types/api.pokecompanion';

	interface Props {
		data: APIPokemon['stats'];
	}

	let { data }: Props = $props();
</script>

<table>
	<thead>
		<tr>
			<th> Stat </th>
			<th id="statTableHeading">
				<p>0</p>
				<p>70 Average</p>
				<p>220</p>
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td class="label"><p>HP</p></td>
			<td class="data">
				<p>{data.hp.stat}</p>
				<div class="wrapper">
					<progress value={data.hp.stat} max="220"></progress>
					<div class="average-marker"></div>
				</div>
			</td>
		</tr>
		<tr>
			<td class="label">
				<p class="long">Attack</p>
				<p class="short">A</p>
			</td>
			<td class="data">
				<p>{data.attack.stat}</p>
				<div class="wrapper">
					<progress value={data.attack.stat} max="220"></progress>
					<div class="average-marker"></div>
				</div>
			</td></tr
		>
		<tr>
			<td class="label">
				<p class="long">Defense</p>
				<p class="short">D</p>
			</td>
			<td class="data">
				<p>{data.defense.stat}</p>
				<div class="wrapper">
					<progress value={data.defense.stat} max="220"></progress>
					<div class="average-marker"></div>
				</div>
			</td>
		</tr>
		<tr>
			<td class="label">
				<p class="long">Speed</p>
				<p class="short">S</p>
			</td>
			<td class="data">
				<p>{data.speed.stat}</p>
				<div class="wrapper">
					<progress value={data.speed.stat} max="220"></progress>
					<div class="average-marker"></div>
				</div>
			</td>
		</tr>
		<tr>
			<td class="label">
				<p class="long">Sp Attack</p>
				<p class="short">Sp A</p>
			</td>
			<td class="data">
				<p>{data['special-attack'].stat}</p>
				<div class="wrapper">
					<progress value={data['special-attack'].stat} max="220"></progress>
					<div class="average-marker"></div>
				</div>
			</td>
		</tr>
		<tr>
			<td class="label">
				<p class="long">Sp Defense</p>
				<p class="short">Sp D</p>
			</td>
			<td class="data">
				<p>{data['special-defense'].stat}</p>
				<div class="wrapper">
					<progress value={data['special-defense'].stat} max="220"></progress>
					<div class="average-marker"></div>
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
				<p><b>{data.average.stat}</b></p>
				<div class="wrapper">
					<progress value={data.average.stat} max="220"></progress>
					<div class="average-marker"></div>
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
