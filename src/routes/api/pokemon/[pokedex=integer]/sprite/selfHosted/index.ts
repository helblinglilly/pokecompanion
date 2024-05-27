import type { IGameGroups } from "$/lib/data/games";
import { Logger } from "$/lib/log";
import { capitaliseEachWord } from "$/lib/utils/string";
import type { ISpriteAPIResponse } from "../types";

export abstract class SelfHostedSprite {
    id: number;
    platform: Readonly<App.Platform> | undefined;
    game: IGameGroups | undefined;
    variety: string | null;
    shiny: boolean;
    female: boolean;
    back: boolean;
    animate: boolean;

    constructor(
        id: number, 
        platform: Readonly<App.Platform> | undefined, 
        game: IGameGroups | undefined, 
        variety: string | null, 
        shiny: boolean, 
        female: boolean, 
        back: boolean, 
        animate: boolean
    ) {
        this.id = id;
        this.platform = platform;
        this.game = game;
        this.variety = variety;
        this.shiny = shiny;
        this.female = female;
        this.back = back;
        this.animate = animate;
    }

    async validatePotentialURL(url: string) {
        return await fetch(url).then((res) => {
            return res.ok;
        }).catch((err) => {
            Logger.error(
                Logger.ErrorClasses.OptionalOperationFailed,
                Logger.buildError(err),
                {
                    context: 'Validating a Scarlet/Violet specific sprite hosted on sprites.pokecompanion.com',
                    id: this.id,
                    variety: this.variety,
                    shiny: this.shiny,
                    female: this.female,
                    back: this.back,
                    animate: this.animate
                }
            )
        });
    }

    abstract GetSprite(): Promise<Partial<ISpriteAPIResponse> | undefined>;

    static baseUrl = 'https://sprites.pokecompanion.com/pokemon';

    static varietyToAlt = (variant: string) => {
        return `${capitaliseEachWord(variant.replaceAll('-', ' '))}`;
    }
}
