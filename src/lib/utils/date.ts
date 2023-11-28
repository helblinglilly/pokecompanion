export const addMinutesToDate = (date: Date, minutes: number): Date => {
	const result = new Date(date);
	result.setTime(result.getTime() + minutes * 60000);
	return result;
};
