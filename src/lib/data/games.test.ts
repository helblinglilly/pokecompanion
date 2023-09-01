import { describe, it, expect } from 'vitest';
import { getGroupName, type IGame } from './games';

describe('getGroupName', () => {
	const mockGameGroup: IGame[] = [
		{
			shortName: "Let's Go Pikachu"
		} as IGame,
		{
			shortName: "Let's Go Eevee"
		} as IGame
	];

	it('Will output in the order provided', () => {
		const output = getGroupName(mockGameGroup, ' / ');
		expect(output).toBe("Let's Go Pikachu / Let's Go Eevee");
	});

	it('Will lowercase the output', () => {
		const output = getGroupName(mockGameGroup, ' / ', true);
		expect(output).toBe("let's go pikachu / let's go eevee");
	});

	it('Will remove all spaces', () => {
		const output = getGroupName(mockGameGroup, ' / ', false, true);
		expect(output).toBe("Let'sGoPikachu / Let'sGoEevee");
	});

	it('Will remove all special characters', () => {
		const output = getGroupName(mockGameGroup, ' / ', false, false, true);
		expect(output).toBe('Lets Go Pikachu / Lets Go Eevee');
	});

	it('Will output the desired format for cookies', () => {
		const output = getGroupName(mockGameGroup, '-', true, true, true);
		expect(output).toBe('letsgopikachu-letsgoeevee');
	});
});
