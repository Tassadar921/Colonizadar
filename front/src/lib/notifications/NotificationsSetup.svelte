<script>
    import { transmit } from '../../stores/transmitStore.js';
    import { Transmit } from '@adonisjs/transmit-client';
    import { addNotification, removeNotification, setPendingFriendRequests, notifications } from '../../stores/notificationStore.js';
    import { showToast } from '../../services/toastService.js';
    import { onMount } from 'svelte';
    import { t } from 'svelte-i18n';
    import { profile } from '../../stores/profileStore.js';
    import axios from 'axios';
    import { navigate } from '../../stores/locationStore.js';

    onMount(() => {
        transmit.set(new Transmit({ baseUrl: process.env.VITE_API_BASE_URL }));
    });

    const setupPendingFriendRequests = async () => {
        const addFriendNotification = $transmit.subscription(`notification/add-friend/${$profile.id}`);
        await addFriendNotification.create();
        addFriendNotification.onMessage((data) => {
            addNotification(data.notification, 'friendRequests');
            showToast(`${$t('toast.notification.friend-request.ask')} ${data.notification.from.username}`, 'warning', '/notifications');
        });

        const cancelAddFriendNotification = $transmit.subscription(`notification/add-friend/cancel/${$profile.id}`);
        await cancelAddFriendNotification.create();
        cancelAddFriendNotification.onMessage((data) => {
            removeNotification(data.notification, 'friendRequests');
        });

        const acceptFriendRequest = $transmit.subscription(`notification/add-friend/accept/${$profile.id}`);
        await acceptFriendRequest.create();
        acceptFriendRequest.onMessage((user) => {
            showToast(`${user.username} ${$t('toast.notification.friend-request.accepted')}`, 'success', '/friends');
        });

        const inviteRequest = $transmit.subscription(`notification/play/invite/${$profile.id}`);
        await inviteRequest.create();
        inviteRequest.onMessage((data) => {
            const handleJoin = async (roomId) => {
                showToast($t('toast.notification.play.accepted'));
                navigate(`/play/room/${roomId}`);
            };
            showToast(`${data.from.username} ${$t('toast.notification.play.invited')}`, 'warning', () => handleJoin(data.roomId));
        });

        await setPendingFriendRequests();
    };

    const setup = async () => {
        await setupPendingFriendRequests();
    };

    $: {
        if ($profile) {
            setup();
        }
    }
</script>
