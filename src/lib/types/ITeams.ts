import type { PokeapiVersionNames } from "../data/games";

export interface ITeam {
    id: string;
    name: string;
    contents: ITeamData;
    owner: string;
    description: string;
    isPrivate: boolean;
    game: PokeapiVersionNames
}

export interface ITeamData {
    party: ITeamPokemon[];
    bench: ITeamPokemon[];
}

export interface ITeamPokemon {
    id: number;
    variety?: string;

    ability?: number;
    moves: {
        id: number;
    }[];

    heldItem?: number;
}

export const TeamInitialContent: ITeamData = {
    party: [],
    bench: []
}