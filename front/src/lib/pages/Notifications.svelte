<script lang="ts">
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { notifications, removeNotification, setPendingFriendRequests } from '../../stores/notificationStore';
    import NotificationModule from '../notifications/NotificationModule.svelte';
    import Loader from '../shared/Loader.svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService.js';

    let loading = false;

    const handleAcceptPendingRequest = async (event: CustomEvent): Promise<void> => {
        const response = await axios.post('/api/friends/accept', { userId: event.detail.from.id });
        if (response.status === 200) {
            removeNotification(event.detail, 'friendRequests');
            showToast(`${event.detail.from.username} ${$t('toast.notification.friend-request.accept')}`, 'success', '/friends');
            if ($notifications.friendRequests.length <= 3) {
                await setPendingFriendRequests();
            }
        }
    };

    const handleRefusePendingRequest = async (event: CustomEvent): Promise<void> => {
        const response = await axios.post('/api/friends/refuse', { userId: event.detail.from.id });
        if (response.status === 200) {
            removeNotification(event.detail, 'friendRequests');
            showToast(`${$t('toast.notification.friend-request.refuse')} ${event.detail.from.username}`, 'success', '/friends');
            if ($notifications.friendRequests.length <= 3) {
                await setPendingFriendRequests();
            }
        }
    };
</script>

<Loader bind:loading />

<Title title={$t('notifications.title')} />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('notifications.title') }]} />

<div class="grid grid-cols-1 md:grid-cols-2">
    <NotificationModule
        bind:notifications={$notifications.friendRequests}
        title={$t('notifications.friend-requests.title')}
        noneMessage={$t('notifications.friend-requests.none')}
        on:accept={handleAcceptPendingRequest}
        on:refuse={handleRefusePendingRequest}
    />
</div>
