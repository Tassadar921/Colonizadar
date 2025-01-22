<script>
    import { transmit } from '../../stores/transmitStore.js';
    import { Transmit } from '@adonisjs/transmit-client';
    import { addNotification, removeNotification, setPendingFriendRequests, notifications } from '../../stores/notificationStore.js';
    import { showToast } from '../../services/toastService.js';
    import { onMount } from 'svelte';
    import { t } from 'svelte-i18n';
    import { profile } from '../../stores/profileStore.js';

    onMount(() => {
        transmit.set(new Transmit({ baseUrl: process.env.VITE_API_BASE_URL }));
    });

    const setup = async () => {
        const addFriendNotification = $transmit.subscription(`notification/add-friend/${$profile.id}`);
        await addFriendNotification.create();
        addFriendNotification.onMessage((data) => {
            addNotification(data.notificationObject, 'friend-request');
            showToast(`${$t('toast.notification.friend-request')} ${data.notificationObject.notification.from.username}`, 'warning', '/notifications');
        });
        const cancelAddFriendNotification = $transmit.subscription(`notification/add-friend/cancel/${$profile.id}`);
        await cancelAddFriendNotification.create();
        cancelAddFriendNotification.onMessage((data) => {
            removeNotification(data.notificationObject, 'friend-request');
        });

        await setPendingFriendRequests();
        console.log($notifications);
    };

    $: {
        if ($profile) {
            setup();
        }
    }
</script>
