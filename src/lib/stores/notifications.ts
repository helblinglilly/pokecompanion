import { writable } from 'svelte/store';

interface INotification {
	message: string;
	level: 'success' | 'failure' | 'info';
	visible: boolean;
}

export const notifications = writable<INotification[]>([]);
