import type { IRecordTeam, ITeam, ITeamPokemon } from '$/lib/types/ITeams';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { Logger } from '$lib/log.js';
import { getUserByUsername } from '$lib/pb/publicUsers';
import { error } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';
import type { ListResult, RecordModel } from 'pocketbase';

export const load = async ({ params }) => {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	const [user, teamData] = await Promise.all([
		getUserByUsername(params.username),
		pb.collection('teams').getList(1, 1, {
			filter: `id="${params.teamId}"`,
			expand: 'party,party.nickname'
		}) as Promise<ListResult<IRecordTeam & RecordModel>>
	]).catch(async (err) => {
		await Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
			context: 'Failed to get teams for user',
			username: params.username
		});
		return [];
	});

	if (!user || !teamData || teamData.totalItems === 0) {
		error(404, 'This team does not exist');
	}

	const team = teamData.items[0];

	const allPokemonIds = (team?.party ?? []).concat(team?.bench ?? []);

	const pokemon: Array<ITeamPokemon & RecordModel> = await pb
		.collection('team_pokemon')
		.getFullList({
			filter: allPokemonIds.map((pokemonId: string) => `id="${pokemonId}"`).join(' || ')
		});

	const party: ITeamPokemon[] = pokemon
		.filter((pokemon) => {
			return (team?.party ?? []).includes(pokemon.id);
		})
		.sort((a, b) => (a.position < b.position ? -1 : 1));

	const bench: ITeamPokemon[] = pokemon
		.filter((pokemon) => {
			return (team?.bench ?? []).includes(pokemon.id);
		})
		.sort((a, b) => (new Date(a.updated) < new Date(b.updated) ? 1 : -1));

	while (party.length < 6) {
		party.push({
			national_dex: -1,
			nickname: undefined,
			variety: undefined,
			gender: 'unknown',
			shiny: false,
			move1: -1,
			move2: -1,
			move3: -1,
			move4: -1,
			ability: 0,
			team: '',
			owner: '',
			id: '',
			position: 6
		});
	}

	console.log(party);

	const fullTeam: ITeam = {
		...team,
		party,
		bench
	};

	return { user, team: fullTeam };
};
