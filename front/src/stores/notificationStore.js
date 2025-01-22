import { writable } from 'svelte/store';
import axios from 'axios';

export const notifications = writable({});

export function updateNotifications(data, type) {
    notifications.update((current) => {
        return {
            ...current,
            [type]: data,
        };
    });
}

export function addNotification(notification, type) {
    notifications.update((current) => {
        return {
            ...current,
            [type]: [...(current[type] || []), notification],
        };
    });
}

export function removeNotification(notification, type) {
    notifications.update((current) => {
        if (!current[type]) {
            return current;
        }

        return {
            ...current,
            [type]: current[type].filter((item) => {
                return item.id !== notification.id;
            }),
        };
    });
}

export async function setPendingFriendRequests() {
    const { data } = await axios.get('/api/notifications/pending-friends?perPage=99');
    updateNotifications(data.notifications, 'friend-request');
}
