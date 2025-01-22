<script>
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import {notifications, setPendingFriendRequests} from '../../stores/notificationStore.js';
    import NotificationModule from "../notifications/NotificationModule.svelte";
    import Loader from "../shared/Loader.svelte";

    let loading = false;

    const handleAcceptPendingRequest = async (event) => {
        console.log(event.detail);
        if ($notifications.friendRequests.length <= 3) {
            await setPendingFriendRequests();
        }
    };

    const handleRefusePendingRequest = async (event) => {
        console.log(event.detail);
        if ($notifications.friendRequests.length <= 3) {
            await setPendingFriendRequests();
        }
    };
</script>

<Loader bind:loading />

<Title title={$t('notifications.title')} />

<Breadcrumbs hasBackground={true} items={[{ label: $t('home.title'), path: '/' }, { label: $t('notifications.title') }]} />

<div class="grid grid-cols-1 md:grid-cols-2">
    <NotificationModule
        bind:notifications={$notifications.friendRequests}
        title={$t('notifications.friend-requests.title')}
        noneMessage={$t('notifications.friend-requests.none')}
        on:accept={handleAcceptPendingRequest}
        on:refuse={handleRefusePendingRequest}
    />
</div>
