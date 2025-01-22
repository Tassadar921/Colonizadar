<script>
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import Button from "../shared/Button.svelte";
    import Pagination from "../shared/Pagination.svelte";
    import Icon from "../shared/Icon.svelte";
    import {onMount} from "svelte";
    import axios from "axios";

    let paginatedPendingFriendNotifications = { notifications: [] };
    let pendingFriendSearchBaseUrl = '/api/notifications/pending-friends';
    let selectedNotification = { message: '' };
    let showModal = false;

    onMount(async () => {
        const { data } = await axios.get(pendingFriendSearchBaseUrl);
        paginatedPendingFriendNotifications = data.notifications;
    });

    const handleAccept = async () => {

    };

    const handleRefuse = async () => {

    };
</script>

<Title title={$t('notifications.title')} />

<Breadcrumbs hasBackground={true} items={[{ label: $t('home.title'), path: '/' }, { label: $t('notifications.title') }]} />

<div class="flex flex-row flex-wrap gap-5 justify-center my-5">
    {#if paginatedPendingFriendNotifications.notifications.length}
        <div class="flex flex-col gap-1 w-full">
            {#each paginatedPendingFriendNotifications.notifications as notificationObject}
                <div class="flex justify-between items-center h-12 border border-gray-800 px-3">
                    <div class="flex gap-5 flex-wrap items-center">
                        <p>{notificationObject.from.username}</p>
                    </div>
                    <div class="flex gap-5">
                        <Button
                            ariaLabel="Accept as friend"
                            customStyle={true}
                            className="transition-colors duration-300 text-green-600 hover:text-green-500"
                            on:click={() => handleAccept(notificationObject)}
                        >
                            <Icon name="confirm" />
                        </Button>
                        <Button
                            ariaLabel="Refuse friend request"
                            customStyle={true}
                            className="transition-colors duration-300 text-red-600 hover:text-red-500"
                            on:click={() => handleRefuse(notificationObject)}
                        >
                            <Icon name="close" />
                        </Button>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p class="my-5">{$t('social.blocked.none')}</p>
    {/if}
</div>
<Pagination bind:paginatedObject={paginatedPendingFriendNotifications} bind:baseUrl={pendingFriendSearchBaseUrl} />

<!--<ConfirmModal bind:showModal on:success={handleUnblockUser}>-->
<!--    <Subtitle slot="header">{$t('social.unblock.modal.title')}</Subtitle>-->
<!--    <p>{selectedNotification.username} {$t('social.unblock.modal.text')}</p>-->
<!--</ConfirmModal>-->
