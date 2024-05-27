import { SelfHostedSprite } from ".";

export class SelfHostedScarletViolet extends SelfHostedSprite {

    private getSelfHostedSpritesURL = async(tryVariety: boolean) => {
        const pokemonName = `${this.id}${this.variety && tryVariety ? '-' + this.variety : ''}`;
        const url = this.animate && this.id >= 906 ? 
            `${SelfHostedSprite.baseUrl}/scarlet-violet/${pokemonName}${this.shiny ? '-shiny' : ''}.gif` : 
            `${SelfHostedSprite.baseUrl}/scarlet-violet/${pokemonName}.png`

        return url;
    }

    async GetSprite(): Promise<{ url: string; alt: string; } | undefined> {
        if (this.female){
            return undefined;
        }
        if (this.variety){
            const specificVarietyURL = await this.getSelfHostedSpritesURL(true);
            if (await this.validatePotentialURL(specificVarietyURL)){
                return {
                    url: specificVarietyURL,
                    alt: 'Front'
                }
            }
        }

        const baseURL = await this.getSelfHostedSpritesURL(false);
        if (await this.validatePotentialURL(baseURL)){
            return {
                url: baseURL,
                alt: 'Front'
            }
        }
        return undefined
    }

}