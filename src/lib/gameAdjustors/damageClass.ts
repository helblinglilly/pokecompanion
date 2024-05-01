const legacyPhysicalTypes = [
	'normal',
	'fighting',
	'poison',
	'ground',
	'flying',
	'bug',
	'rock',
	'ghost',
	'steel'
];
const legacySpecialTypes = [
	'fire',
	'water',
	'electric',
	'grass',
	'ice',
	'physic',
	'dragon',
	'dark'
];

const getLegacyDamageClass = (existing: string, type: string) => {
	if (existing === 'status') {
		return 'status';
	}
	if (legacyPhysicalTypes.includes(type)) {
		return 'physical';
	}
	if (legacySpecialTypes.includes(type)) {
		return 'special';
	}
	return existing;
};

export default getLegacyDamageClass;