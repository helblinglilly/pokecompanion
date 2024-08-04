import type { IGameGroups } from "$/lib/data/games";
import { animateSprites, versionSpecificPokemonSprites } from "$/lib/stores/domain";
import { get } from "svelte/store";

export async function getSpriteURL(id: number, shiny: boolean, isFemale: boolean, variety: string | undefined, game: IGameGroups | undefined ){
    const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const queryParamsCopy = new URLSearchParams();
    queryParamsCopy.set('shiny', `${shiny}`);
    queryParamsCopy.set('gender', isFemale ? 'female' : '');
    queryParamsCopy.set('variety', variety ? variety : '');

    if (get(versionSpecificPokemonSprites) === true && game) {
        queryParamsCopy.set('game', game.pokeapi);

        if (get(animateSprites)) {
            queryParamsCopy.set('animate', 'true');
        }
    }

    const res = await fetch(`/api/pokemon/${id}/sprite?${queryParamsCopy.toString()}`);
    if (res.ok) {
        return await res.text();
    }
    return fallbackSpriteUrl;
}