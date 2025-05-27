<script lang="ts">
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { notifications, removeNotification, setPendingFriendRequests } from '../../stores/notificationStore';
    import NotificationModule from '../notifications/NotificationModule.svelte';
    import Loader from '../shared/Loader.svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import { MetaTags } from 'svelte-meta-tags';

    let isLoading: boolean = false;

    const handleAcceptPendingRequest = async (event: CustomEvent): Promise<void> => {
        try {
            const { data } = await axios.post('/api/friends/accept', { userId: event.detail.from.id });
            removeNotification(event.detail, 'friendRequests');
            showToast(data.message, 'success', '/friends');
            if ($notifications.friendRequests.length <= 3) {
                await setPendingFriendRequests();
            }
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const handleRefusePendingRequest = async (event: CustomEvent): Promise<void> => {
        try {
            const { data } = await axios.post('/api/friends/refuse', { userId: event.detail.from.id });
            removeNotification(event.detail, 'friendRequests');
            showToast(data.message, 'success', '/friends');
            if ($notifications.friendRequests.length <= 3) {
                await setPendingFriendRequests();
            }
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };
</script>

<MetaTags
    title={$t('notifications.meta.title')}
    description={$t('notifications.meta.description')}
    keywords={$t('notifications.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/notifications`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/notifications`,
        },
    ]}
/>

<Loader {isLoading} />

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
