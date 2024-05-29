import { SelfHostedSprite } from ".";

export class SelfHostedSwordShield extends SelfHostedSprite {
    async GetSprite(): Promise<{ url: string; alt: string; } | undefined> {
        let pokemonName = `${this.id}`;

        if (this.variety){
            pokemonName += `-${this.variety}`;
        }

        if (this.female){
            pokemonName += '-female';
        }

        if (this.shiny){
            pokemonName += '-shiny';
        }

        const baseURL = SelfHostedSprite.baseUrl + `/sword-shield/${pokemonName}.gif`;

        if (await this.validatePotentialURL(baseURL)){
            return {
                url: baseURL,
                alt: `Front ${this.shiny ? ' shiny' : ''}${this.female ? ' female' : ''}${this.variety ? SelfHostedSprite.varietyToAlt(this.variety) : ''}`
            }
        }
        return undefined
    }

}