export const daysPassedInYear = (): number => {
	const date = new Date();
	const days =
		new Date(date.getTime() - new Date(`${date.getFullYear()}-01-01`).getTime()).valueOf() /
		(1000 * 3600 * 24);
	return Math.floor(days);
};

const shuffle = (arr: number[], randomNumbers: number[]): number[] => {
	let currentIndex = arr.length,
		randomIndex;

	while (currentIndex != 0) {
		// @ts-expect-error cba
		randomIndex = Math.floor(randomNumbers[currentIndex]);
		currentIndex--;

		// @ts-expect-error cba
		[arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
	}

	return arr;
};

export const randomDailyNumber = (maxNumber: number): number[] => {
	const arr: number[] = [];
	for (let i = 1; i <= maxNumber; i++) arr.push(i);

	const randomNumbers: number[] = [];
	for (let i = 0; i < maxNumber; i++) {
		if (i % 2 === 0) randomNumbers.push(i);
		else randomNumbers.unshift(i);
	}

	return shuffle(arr, randomNumbers);
};
