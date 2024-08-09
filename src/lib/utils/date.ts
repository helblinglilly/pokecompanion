export const addMinutesToDate = (date: Date, minutes: number): Date => {
	const result = new Date(date);
	result.setTime(result.getTime() + minutes * 60000);
	return result;
};

export const addDaysToDate = (date: Date, days: number): Date => {
	return addMinutesToDate(date, 60 * 24 * days);
};
