import { SelfHostedSprite } from ".";

export class SelfHostedLegendsArceus extends SelfHostedSprite {
    async GetSprite(): Promise<{ url: string; alt: string; } | undefined> {
        const pokemonName = `${this.id}`;

        if (this.variety){
            const varietyPokemonName = `${pokemonName}${this.variety ? '-' + this.variety : ''}`;


            const varietyURL = SelfHostedSprite.baseUrl + `/legends-arceus/${varietyPokemonName}.png`;
            if (await this.validatePotentialURL(varietyURL)){
                return {
                    url: varietyURL,
                    alt: `Front ${SelfHostedSprite.varietyToAlt(this.variety)}`
                }
            }
        }

        const baseURL = SelfHostedSprite.baseUrl + `/legends-arceus/${pokemonName}.png`;

        if (await this.validatePotentialURL(baseURL)){
            return {
                url: baseURL,
                alt: 'Front'
            }
        }

        console.log('returning undefined', baseURL);
        return undefined
    }

}