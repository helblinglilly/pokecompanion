import { writable } from 'svelte/store';

export interface INotification {
	message: string;
	level: 'success' | 'failure' | 'info';
}

export const notifications = writable<INotification[]>([]);

export function addNotification(notification: INotification) {
	notifications.update((currentNotifications) => [...currentNotifications, notification]);

	setTimeout(() => {
		removeNotification(notification);
	}, 5 * 1000);
}

export function removeNotification(notification: INotification) {
	notifications.update((currentNotifications) =>
		currentNotifications.filter((n) => n !== notification)
	);
}

export function clearNotifications() {
	notifications.set([]);
}
