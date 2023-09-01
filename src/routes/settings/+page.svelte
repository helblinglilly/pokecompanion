<script>
	import { gameGroups } from '$lib/data/games';
</script>

<h1 style="margin-bottom: 20px;">Settings</h1>

<section>
	<div class="card">
		<h3>Select Game</h3>
		<select>
			{#each gameGroups as gameGroup}
				<option>
					{gameGroup.map((game) => game.shortName).join(' / ')}
				</option>
			{/each}
		</select>
	</div>
	<div class="card">
		<h3>Select Languages</h3>
	</div>
</section>
