import type { ISprites } from "$/lib/types/IPokemon";
import type { ISpriteData } from "./types";

export function extractBaseSprites(
	sprites: ISprites,
	versionSpecificSprites: boolean,
	selectedGame: string | undefined,
	animatedSprites: boolean
): {
	primary: ISpriteData;
	secondary: ISpriteData;
	meta: {
		hasFemaleSprite: boolean;
		hasShinySprite: boolean;
	};
} {
	const baseSprites = {
		primary: {
			default: sprites.front_default,
			shiny: sprites.front_shiny,
			female: sprites.front_female,
			shinyFemale: sprites.front_shiny_female
		},
		secondary: {
			default: sprites.back_default ?? '',
			shiny: sprites.back_shiny,
			female: sprites.back_female,
			shinyFemale: sprites.back_shiny_female
		},
		meta: {
			hasFemaleSprite: false,
			hasShinySprite: false
		}
	};

	if (versionSpecificSprites && selectedGame && sprites.versions) {
		if (selectedGame === 'red-blue' && sprites.versions['generation-i']) {
			baseSprites.primary.default =
				sprites.versions['generation-i']['red-blue'].front_transparent ||
				baseSprites.primary.default;
			// baseSprites.primary.grey = sprites.versions['generation-i']['red-blue'].front_gray || baseSprites.primary.grey;
			baseSprites.secondary.default =
				sprites.versions['generation-i']['red-blue'].back_transparent ||
				baseSprites.secondary.default;
			// baseSprites.secondary.grey = sprites.versions['generation-i']['red-blue'].back_gray || baseSprites.secondary.grey;
		} else if (selectedGame === 'yellow' && sprites.versions['generation-i']) {
			baseSprites.primary.default =
				sprites.versions['generation-i']['yellow'].front_transparent || baseSprites.primary.default;
			// baseSprites.primary.grey = sprites.versions['generation-i']['yellow'].front_gray || baseSprites.primary.grey;
			baseSprites.secondary.default =
				sprites.versions['generation-i']['yellow'].back_transparent ||
				baseSprites.secondary.default;
			// baseSprites.secondary.grey = sprites.versions['generation-i']['yellow'].back_gray || baseSprites.secondary.grey;
		} else if (selectedGame === 'gold-silver' && sprites.versions['generation-ii']) {
			baseSprites.primary.default =
				sprites.versions['generation-ii'].gold.front_default || baseSprites.primary.default;
			baseSprites.primary.shiny =
				sprites.versions['generation-ii'].gold.front_shiny || baseSprites.primary.shiny;
			baseSprites.secondary.default =
				sprites.versions['generation-ii'].gold.back_default || baseSprites.secondary.default;
			baseSprites.secondary.shiny =
				sprites.versions['generation-ii'].gold.back_shiny || baseSprites.secondary.shiny;
		} else if (selectedGame === 'crystal' && sprites.versions['generation-ii']) {
			baseSprites.primary.default =
				sprites.versions['generation-ii'].crystal.front_default || baseSprites.primary.default;
			baseSprites.primary.shiny =
				sprites.versions['generation-ii'].crystal.front_shiny || baseSprites.primary.shiny;
			baseSprites.secondary.default =
				sprites.versions['generation-ii'].crystal.back_default || baseSprites.secondary.default;
			baseSprites.secondary.shiny =
				sprites.versions['generation-ii'].crystal.back_shiny || baseSprites.secondary.shiny;
		} else if (selectedGame === 'ruby-sapphire' && sprites.versions['generation-iii']) {
			baseSprites.primary.default =
				sprites.versions['generation-iii']['ruby-sapphire'].front_default ||
				baseSprites.primary.default;
			baseSprites.primary.shiny =
				sprites.versions['generation-iii']['ruby-sapphire'].front_shiny ||
				baseSprites.primary.shiny;
			baseSprites.secondary.default =
				sprites.versions['generation-iii']['ruby-sapphire'].back_default ||
				baseSprites.secondary.default;
			baseSprites.secondary.shiny =
				sprites.versions['generation-iii']['ruby-sapphire'].back_shiny ||
				baseSprites.secondary.shiny;
		} else if (selectedGame === 'emerald' && sprites.versions['generation-iii']) {
			baseSprites.primary.default =
				sprites.versions['generation-iii']['emerald'].front_default || baseSprites.primary.default;
			baseSprites.primary.shiny =
				sprites.versions['generation-iii']['emerald'].front_shiny || baseSprites.primary.shiny;
			baseSprites.secondary.default = sprites.back_default || baseSprites.secondary.default;
			baseSprites.secondary.shiny = sprites.back_shiny || baseSprites.secondary.shiny;
		} else if (selectedGame === 'diamond-pearl' && sprites.versions['generation-iv']) {
			baseSprites.primary.default =
				sprites.versions['generation-iv']['diamond-pearl'].front_default ||
				baseSprites.primary.default;
			baseSprites.primary.shiny =
				sprites.versions['generation-iv']['diamond-pearl'].front_shiny || baseSprites.primary.shiny;
			baseSprites.primary.female =
				sprites.versions['generation-iv']['diamond-pearl'].front_female ||
				baseSprites.primary.female;
			baseSprites.primary.shinyFemale =
				sprites.versions['generation-iv']['diamond-pearl'].front_shiny_female ||
				baseSprites.primary.shinyFemale;
			baseSprites.secondary.default =
				sprites.versions['generation-iv']['diamond-pearl'].back_default ||
				baseSprites.secondary.default;
			baseSprites.secondary.shiny =
				sprites.versions['generation-iv']['diamond-pearl'].back_shiny ||
				baseSprites.secondary.shiny;
			baseSprites.secondary.female =
				sprites.versions['generation-iv']['diamond-pearl'].back_female ||
				baseSprites.secondary.female;
			baseSprites.secondary.shinyFemale =
				sprites.versions['generation-iv']['diamond-pearl'].back_shiny_female ||
				baseSprites.secondary.shinyFemale;
		} else if (selectedGame === 'platinum' && sprites.versions['generation-iv']) {
			baseSprites.primary.default =
				sprites.versions['generation-iv'].platinum.front_default || baseSprites.primary.default;
			baseSprites.primary.shiny =
				sprites.versions['generation-iv'].platinum.front_shiny || baseSprites.primary.shiny;
			baseSprites.primary.female =
				sprites.versions['generation-iv'].platinum.front_female || baseSprites.primary.female;
			baseSprites.primary.shinyFemale =
				sprites.versions['generation-iv'].platinum.front_shiny_female ||
				baseSprites.primary.shinyFemale;
			baseSprites.secondary.default =
				sprites.versions['generation-iv'].platinum.back_default || baseSprites.secondary.default;
			baseSprites.secondary.shiny =
				sprites.versions['generation-iv'].platinum.back_shiny || baseSprites.secondary.shiny;
			baseSprites.secondary.female =
				sprites.versions['generation-iv'].platinum.back_female || baseSprites.secondary.female;
			baseSprites.secondary.shinyFemale =
				sprites.versions['generation-iv'].platinum.back_shiny_female ||
				baseSprites.secondary.shinyFemale;
		} else if (selectedGame === 'heartgold-soulsilver' && sprites.versions['generation-iv']) {
			baseSprites.primary.default =
				sprites.versions['generation-iv']['heartgold-soulsilver'].front_default ||
				baseSprites.primary.default;
			baseSprites.primary.shiny =
				sprites.versions['generation-iv']['heartgold-soulsilver'].front_shiny ||
				baseSprites.primary.shiny;
			baseSprites.primary.female =
				sprites.versions['generation-iv']['heartgold-soulsilver'].front_female ||
				baseSprites.primary.female;
			baseSprites.primary.shinyFemale =
				sprites.versions['generation-iv']['heartgold-soulsilver'].front_shiny_female ||
				baseSprites.primary.shinyFemale;
			baseSprites.secondary.default =
				sprites.versions['generation-iv']['heartgold-soulsilver'].back_default ||
				baseSprites.secondary.default;
			baseSprites.secondary.shiny =
				sprites.versions['generation-iv']['heartgold-soulsilver'].back_shiny ||
				baseSprites.secondary.shiny;
			baseSprites.secondary.female =
				sprites.versions['generation-iv']['heartgold-soulsilver'].back_female ||
				baseSprites.secondary.female;
			baseSprites.secondary.shinyFemale =
				sprites.versions['generation-iv']['heartgold-soulsilver'].back_shiny_female ||
				baseSprites.secondary.shinyFemale;
		} else if (
			(selectedGame === 'black-white' || selectedGame === 'black-2-white-2') &&
			sprites.versions['generation-v']
		) {
			if (animatedSprites) {
				baseSprites.primary.default =
					sprites.versions['generation-v']['black-white'].animated.front_default ??
					(sprites.versions['generation-v']['black-white'].front_default ||
						baseSprites.primary.default);
				baseSprites.primary.shiny =
					sprites.versions['generation-v']['black-white'].animated.front_shiny ??
					(sprites.versions['generation-v']['black-white'].front_shiny ||
						baseSprites.primary.shiny);
				baseSprites.primary.female =
					sprites.versions['generation-v']['black-white'].animated.front_female ??
					(sprites.versions['generation-v']['black-white'].front_female ||
						baseSprites.primary.female);
				baseSprites.primary.shinyFemale =
					sprites.versions['generation-v']['black-white'].animated.front_shiny_female ??
					(sprites.versions['generation-v']['black-white'].front_shiny_female ||
						baseSprites.primary.shinyFemale);
				baseSprites.secondary.default =
					sprites.versions['generation-v']['black-white'].animated.back_default ??
					(sprites.versions['generation-v']['black-white'].back_default ||
						baseSprites.secondary.default);
				baseSprites.secondary.shiny =
					sprites.versions['generation-v']['black-white'].animated.back_shiny ??
					(sprites.versions['generation-v']['black-white'].back_shiny ||
						baseSprites.secondary.shiny);
				baseSprites.secondary.female =
					sprites.versions['generation-v']['black-white'].animated.back_female ??
					(sprites.versions['generation-v']['black-white'].back_female ||
						baseSprites.secondary.female);
				baseSprites.secondary.shinyFemale =
					sprites.versions['generation-v']['black-white'].animated.back_shiny_female ??
					(sprites.versions['generation-v']['black-white'].back_shiny_female ||
						baseSprites.secondary.shinyFemale);
			} else {
				baseSprites.primary.default =
					sprites.versions['generation-v']['black-white'].front_default ||
					baseSprites.primary.default;
				baseSprites.primary.shiny =
					sprites.versions['generation-v']['black-white'].front_shiny || baseSprites.primary.shiny;
				baseSprites.primary.female =
					sprites.versions['generation-v']['black-white'].front_female ||
					baseSprites.primary.female;
				baseSprites.primary.shinyFemale =
					sprites.versions['generation-v']['black-white'].front_shiny_female ||
					baseSprites.primary.shinyFemale;
				baseSprites.secondary.default =
					sprites.versions['generation-v']['black-white'].back_default ||
					baseSprites.secondary.default;
				baseSprites.secondary.shiny =
					sprites.versions['generation-v']['black-white'].back_shiny || baseSprites.secondary.shiny;
				baseSprites.secondary.female =
					sprites.versions['generation-v']['black-white'].back_female ||
					baseSprites.secondary.female;
				baseSprites.secondary.shinyFemale =
					sprites.versions['generation-v']['black-white'].back_shiny_female ||
					baseSprites.secondary.shinyFemale;
			}
		} else if (selectedGame === 'x-y' && sprites.versions['generation-vi']) {
			baseSprites.primary.default =
				sprites.versions['generation-vi']['x-y'].front_default || baseSprites.primary.default;
			baseSprites.primary.shiny =
				sprites.versions['generation-vi']['x-y'].front_shiny || baseSprites.primary.shiny;
			baseSprites.primary.female =
				sprites.versions['generation-vi']['x-y'].front_female || baseSprites.primary.female;
			baseSprites.primary.shinyFemale =
				sprites.versions['generation-vi']['x-y'].front_shiny_female ||
				baseSprites.primary.shinyFemale;
			baseSprites.secondary.default = sprites.back_default || baseSprites.secondary.default;
			baseSprites.secondary.shiny = sprites.back_shiny || baseSprites.secondary.shiny;
			baseSprites.secondary.female = sprites.back_female || baseSprites.secondary.female;
			baseSprites.secondary.shinyFemale =
				sprites.back_shiny_female || baseSprites.secondary.shinyFemale;
		} else if (selectedGame === 'omegaruby-alphasapphire' && sprites.versions['generation-vi']) {
			baseSprites.primary.default =
				sprites.versions['generation-vi']['omegaruby-alphasapphire'].front_default ||
				baseSprites.primary.default;
			baseSprites.primary.shiny =
				sprites.versions['generation-vi']['omegaruby-alphasapphire'].front_shiny ||
				baseSprites.primary.shiny;
			baseSprites.primary.female =
				sprites.versions['generation-vi']['omegaruby-alphasapphire'].front_female ||
				baseSprites.primary.female;
			baseSprites.primary.shinyFemale =
				sprites.versions['generation-vi']['omegaruby-alphasapphire'].front_shiny_female ||
				baseSprites.primary.shinyFemale;
			baseSprites.secondary.default = sprites.back_default || baseSprites.secondary.default;
			baseSprites.secondary.shiny = sprites.back_shiny || baseSprites.secondary.shiny;
			baseSprites.secondary.female = sprites.back_female || baseSprites.secondary.female;
			baseSprites.secondary.shinyFemale =
				sprites.back_shiny_female || baseSprites.secondary.shinyFemale;
		} else if (
			(selectedGame === 'sun-moon' || selectedGame === 'ultrasun-ultramoon') &&
			sprites.versions['generation-vii']
		) {
			baseSprites.primary.default =
				sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_default ||
				baseSprites.primary.default;
			baseSprites.primary.shiny =
				sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_shiny ||
				baseSprites.primary.shiny;
			baseSprites.primary.female =
				sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_female ||
				baseSprites.primary.female;
			baseSprites.primary.shinyFemale =
				sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_shiny_female ||
				baseSprites.primary.shinyFemale;
			baseSprites.secondary.default = sprites.back_default || baseSprites.secondary.default;
			baseSprites.secondary.shiny = sprites.back_shiny || baseSprites.secondary.shiny;
			baseSprites.secondary.female = sprites.back_female || baseSprites.secondary.female;
			baseSprites.secondary.shinyFemale =
				sprites.back_shiny_female || baseSprites.secondary.shinyFemale;
		}
	}

	if (baseSprites.primary.female) {
		baseSprites.meta.hasFemaleSprite = true;
	}
	if (baseSprites.primary.shiny) {
		baseSprites.meta.hasShinySprite = true;
	}

	return baseSprites;
};