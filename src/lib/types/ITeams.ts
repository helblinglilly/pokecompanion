import type { PokeapiVersionNames } from "../data/games";

interface IBaseTeam {
    id: string;
    name: string;
    owner: string;
    description: string;
    isPrivate: boolean;
    game: PokeapiVersionNames;
    isActiveForGame: boolean;
}


export interface IRecordTeam extends IBaseTeam{
    party: string[];
    bench: string[];
}

export interface ITeam extends IBaseTeam {
    party: ITeamPokemon[];
    bench: ITeamPokemon[];
}

export interface IBasePokemon {
    national_dex: number;
    nickname: string | undefined;
    variety: string | undefined;
    gender: 'male' | 'female' | 'unknown';
    shiny: boolean;
    ability: number;
    move1: number;
    move2: number;
    move3: number;
    move4: number;
}

export interface ITeamPokemon extends IBasePokemon {
    id: string;
    team: string;
    owner: string;
    position: number;
}
