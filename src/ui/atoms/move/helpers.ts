import type { IGameGroups } from "$/lib/data/games";
import { getMove } from "$/lib/types/IMoves";
import { getNameEntry } from "$/lib/utils/language";
import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
import { get } from "svelte/store";

export async function getMoveName(id: number, game: IGameGroups | undefined) {
    if (id < 0) {
        return '-';
    }
    const move = await getMove(id, game);
    return (
        getNameEntry(move.names, get(primaryLanguage)) ??
        getNameEntry(move.names, get(secondaryLanguage)) ??
        'No data'
    );
}