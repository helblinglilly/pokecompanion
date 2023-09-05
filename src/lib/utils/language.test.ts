import { describe, expect, test } from 'vitest';
import { getLanguageEntry, getMultiLanguageName } from './language';

describe('getLanguageEntry', () => {
	test('will return undefined on empty data', () => {
		expect(getLanguageEntry([], 'de')).toBe(undefined);
	});
	test('will return undefined if thats the entrys value', () => {
		expect(getLanguageEntry([{ de: undefined }], 'de')).toBe(undefined);
	});
	test('will return the matching entry', () => {
		expect(getLanguageEntry([{ de: 'world' }], 'de')).toBe('world');
	});
});

describe('getMultiLanguageName', () => {
	test('will return "Missing data" on emtpy input', () => {
		expect(getMultiLanguageName([], 'de', 'en')).toBe('Missing data');
	});

	test("will return only one entry if the other doesn't exist", () => {
		const input = [
			{
				de: 'world'
			}
		];
		expect(getMultiLanguageName(input, 'de', 'en')).toBe('world');
	});

	test("will return the one entry if they're the same", () => {
		const input = [
			{
				de: 'world'
			},
			{
				en: 'world'
			}
		];
		expect(getMultiLanguageName(input, 'de', 'en')).toBe('world');
	});

	test('will return the entries in correct order', () => {
		const input = [
			{
				de: 'hello'
			},
			{
				en: 'world'
			}
		];
		expect(getMultiLanguageName(input, 'de', 'en')).toBe('hello - world');
	});

	test('will return the entries in correct order', () => {
		const input = [
			{
				de: 'hello'
			},
			{
				en: 'world'
			}
		];
		expect(getMultiLanguageName(input, 'en', 'de')).toBe('world - hello');
	});
});
