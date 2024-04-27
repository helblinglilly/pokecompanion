/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/svelte";
import VersionGroupSelector from ".";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Generations, PokeapiVersionGroups, PokeapiVersionNames, Regions, type IGameGroups } from "$lib/data/games";

const sampleGameGroups: IGameGroups[] = [
	{
		pokeapi: PokeapiVersionGroups.RED_BLUE,
		shortName: 'Red / Blue',
		generation: Generations[0],
		games: [{
			pokeapi: PokeapiVersionNames.RED,
			shortName: 'Red'
		}, {
			pokeapi: PokeapiVersionNames.BLUE,
			shortName: 'Blue'
		}],
		region: Regions.KANTO,
		dlcGames: [],
	},
	{
		pokeapi: PokeapiVersionGroups.YELLOW,
		shortName: 'Yellow',
		generation: Generations[0],
		games: [{
			pokeapi: PokeapiVersionNames.YELLOW,
			shortName: 'Yellow'
		}],
		region: Regions.KANTO,
		dlcGames: [],
	},
	{
		pokeapi: PokeapiVersionGroups.GOLD_SILVER,
		shortName: 'Gold / Silver',
		generation: Generations[1],
		games: [{
			pokeapi: PokeapiVersionNames.GOLD,
			shortName: 'Gold'
		}, {
			pokeapi: PokeapiVersionNames.SILVER,
			shortName: 'Silver'
		}],
		region: Regions.JOHTO,
		dlcGames: [],
	},
	{
		pokeapi: PokeapiVersionGroups.CRYSTAL,
		shortName: 'Crystal',
		generation: Generations[1],
		games: [{
			pokeapi: PokeapiVersionNames.CRYSTAL,
			shortName: 'Crystal'
		}],
		region: Regions.JOHTO,
		dlcGames: [],
	},

]

describe("VersionGroupSelector", () => {
	afterEach(() => {
		cleanup();
	  });
	  
    it("should render all the the version group names provided", () => {
        render(VersionGroupSelector, { props: { 
            versionGroups: sampleGameGroups,
            currentlySelected: undefined,
            onChange: () => 1,
        } });

		const select = screen.getByRole('combobox');
		const options = within(select).getAllByRole('option') as unknown as HTMLSelectElement[];

		const expectedOptions = ['red-blue', 'yellow', 'gold-silver', 'crystal'];

		expectedOptions.forEach((optionText, index) => {
			expect(options[index].value).to.eq(optionText)
		});
    });

	it("should select the corresponding entry", () => {
		render(VersionGroupSelector, { props: { 
            versionGroups: sampleGameGroups,
            currentlySelected: PokeapiVersionGroups.GOLD_SILVER,
            onChange: () => 1,
        } });

		const select = screen.getByRole('combobox');
		const selectedOption = within(select).getByRole('option', { selected: true }) as unknown as HTMLSelectElement;
		expect(selectedOption.value).toBe(PokeapiVersionGroups.GOLD_SILVER);
	})

	it("should call the onChange callback with the newly selected option", () => {
		const onChangeMock = vi.fn();
		
		render(VersionGroupSelector, {
			props: {
				versionGroups: sampleGameGroups,
				currentlySelected: undefined,
				onChange: onChangeMock,
			},
		});

		const select = screen.getByRole('combobox');
		const options = within(select).getAllByRole('option') as unknown as HTMLSelectElement[];

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore Does exist on selectElement
		options[2].selected = true; // Gold / Silver
		fireEvent.change(select);

		expect(onChangeMock).toHaveBeenCalledWith('gold-silver');
	});

	describe('isVisibleOnEmptyOptions and the provided collection is empty', () => {
		it('should render the select if the option is set to true', () => {
			render(VersionGroupSelector, { props: { 
				versionGroups: [],
				currentlySelected: undefined,
				onChange: () => 1,
				isVisibleOnEmptyOptions: true
			} });

			expect(screen.getByRole('combobox')).to.exist;
		})

		it('should not render the select if the option is set to false', () => {
			render(VersionGroupSelector, { props: { 
				versionGroups: [],
				currentlySelected: undefined,
				onChange: () => 1,
				isVisibleOnEmptyOptions: false
			} });

			expect(screen.queryByRole('combobox')).not.to.exist;
		})
	});

	describe('showGenericOption', () => {
		it('renders the generic option', () => {
			render(VersionGroupSelector, { props: { 
				versionGroups: [],
				currentlySelected: undefined,
				onChange: () => 1,
				isVisibleOnEmptyOptions: true,
				showGenericOption: true
			} });

			const select = screen.getByRole('combobox');
			const options = within(select).getAllByRole('option') as unknown as HTMLSelectElement[];

			expect(options[0].value).to.eq('generic');
		})
		it('selects the generic option if no game is selected', () => {
			render(VersionGroupSelector, { props: { 
				versionGroups: sampleGameGroups,
				currentlySelected: undefined,
				onChange: () => 1,
				showGenericOption: true
			} });

			const select = screen.getByRole('combobox');
			const selectedOption = within(select).getByRole('option', { selected: true }) as unknown as HTMLSelectElement;
			expect(selectedOption.value).toBe('generic');
		});
	});
});