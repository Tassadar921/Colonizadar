<script>
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Pagination from '../shared/Pagination.svelte';
    import { showToast } from '../../services/toastService.js';
    import Search from '../shared/Search.svelte';
    import Icon from '../shared/Icon.svelte';
    import Button from '../shared/Button.svelte';
    import ConfirmModal from '../shared/ConfirmModal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import { transmit } from '../../stores/transmitStore.js';
    import { Transmit } from '@adonisjs/transmit-client';
    import { profile } from '../../stores/profileStore.js';
    import { createEventDispatcher } from 'svelte';
    import { addNotification, removeNotification, setPendingFriendRequests } from '../../stores/notificationStore.js';

    const dispatch = createEventDispatcher();

    let paginatedUsers = { users: [] };
    let searchBaseUrl = '/api/friends/add?';
    let query = '';
    let showModal = false;
    let blockingUser = { username: '' };

    onMount(async () => {
        transmit.set(new Transmit({ baseUrl: process.env.VITE_API_BASE_URL }));
        await updateAddFriends();
    });

    const updateAddFriends = async () => {
        const { data } = await axios.get(searchBaseUrl);
        paginatedUsers = data.users;
    };

    const handleSearch = async () => {
        searchBaseUrl = `/api/friends/add?${query ? `query=${query}` : ''}`;
        const response = await axios.get(searchBaseUrl);
        if (response.status === 200) {
            paginatedUsers = response.data.users;
        } else {
            showToast($t('toast.friends.search.error'), 'error');
        }
    };

    const handleAddFriend = async (user) => {
        const response = await axios.post('/api/friends/ask', {
            userId: user.id,
        });
        if (response.status === 200) {
            updateUser(user.id, { sentFriendRequest: true });
            showToast($t('toast.friends.add.success'));
        } else {
            showToast($t('toast.friends.add.error'), 'error');
        }
    };

    const handleCancelFriendRequest = async (user) => {
        const response = await axios.delete(`/api/friends/pending/cancel/${user.id}`);

        if (response.status === 200) {
            updateUser(user.id, { sentFriendRequest: false });
            showToast($t('toast.friends.add.cancel.success'));
        } else {
            showToast($t('toast.friends.add.cancel.error'), 'error');
        }
    };

    const handleBlockUser = async () => {
        const response = await axios.get(`/api/blocked/add/${blockingUser.id}`);
        if (response.status === 200) {
            paginatedUsers.users = paginatedUsers.users.filter((currentUser) => currentUser.id !== blockingUser.id);
            showToast($t('toast.blocked.success'));
        } else {
            showToast($t('toast.blocked.error'), 'error');
        }
        showModal = false;
    };

    const updateUser = (userId, updates) => {
        paginatedUsers = {
            ...paginatedUsers,
            users: paginatedUsers.users.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
        };
    };

    const handleShowBlockingModal = (user) => {
        blockingUser = user;
        showModal = true;
    };

    const setupEvents = async () => {
        // sender updated when receiver accepts friend request
        const acceptedFriendRequest = $transmit.subscription(`notification/add-friend/accept/${$profile.id}`);
        await acceptedFriendRequest.create();
        acceptedFriendRequest.onMessage((user) => {
            paginatedUsers.users = paginatedUsers.users.filter((currentUser) => currentUser.id !== user.id);
            dispatch('updateFriends');
        });

        // sender updated when friend request is refused by receiver
        const refuseFriendRequest = $transmit.subscription(`notification/add-friend/refuse/${$profile.id}`);
        await refuseFriendRequest.create();
        refuseFriendRequest.onMessage((user) => {
            updateUser(user.id, { sentFriendRequest: false });
        });

        // receiver updated when request received
        const receivedFriendRequest = $transmit.subscription(`notification/add-friend/${$profile.id}`);
        await receivedFriendRequest.create();
        receivedFriendRequest.onMessage((data) => {
            updateUser(data.notification.from.id, { receivedFriendRequest: true });
        });

        // receiver updated when his request is canceled by sender
        const cancelFriendRequest = $transmit.subscription(`notification/add-friend/cancel/${$profile.id}`);
        await cancelFriendRequest.create();
        cancelFriendRequest.onMessage((data) => {
            updateUser(data.notification.from.id, { receivedFriendRequest: false });
        });

        // receiver updated when becomes blocked
        const blockedUser = $transmit.subscription(`notification/blocked/${$profile.id}`);
        await blockedUser.create();
        blockedUser.onMessage((user) => {
            paginatedUsers.users = paginatedUsers.users.filter((currentUser) => currentUser.id !== user.id);
        });

        // receiver updated when becomes unblocked
        const unblockedUser = $transmit.subscription(`notification/unblocked/${$profile.id}`);
        await unblockedUser.create();
        unblockedUser.onMessage(async () => {
            await updateAddFriends();
        });

        // update when a user removes us from its friends
        const removeFriend = $transmit.subscription(`notification/friend/remove/${$profile.id}`);
        await removeFriend.create();
        removeFriend.onMessage(async () => {
            await updateAddFriends();
        });
    };

    const handleAcceptPendingRequest = async (user) => {
        const response = await axios.post('/api/friends/accept', { userId: user.id });
        if (response.status === 200) {
            showToast(`${user.username} ${$t('toast.notification.friend-request.accept')}`, 'success', '/friends');
            await setPendingFriendRequests();
            paginatedUsers.users = paginatedUsers.users.filter((currentUser) => currentUser.id !== user.id);
            dispatch('updateFriends');
        }
    };

    const handleRefusePendingRequest = async (user) => {
        const response = await axios.post('/api/friends/refuse', { userId: user.id });
        if (response.status === 200) {
            showToast(`${$t('toast.notification.friend-request.refuse')} ${user.username}`, 'success', '/friends');
            await setPendingFriendRequests();
            updateUser(user.id, { receivedFriendRequest: false });
        }
    };

    $: {
        if ($profile) {
            setupEvents();
        }
    }
</script>

<Search
    selected={true}
    bind:results={paginatedUsers.users}
    placeholder={$t('social.friends.add.search.placeholder')}
    label={$t('social.friends.add.search.label')}
    name="search-user"
    minChars={3}
    bind:search={query}
    on:search={handleSearch}
/>

<div class="flex flex-row flex-wrap gap-5 justify-center my-5">
    {#if paginatedUsers.users.length}
        <div class="flex flex-col gap-1 w-full">
            {#each paginatedUsers.users as user}
                <div class="flex justify-between items-center h-12 border border-gray-300 dark:border-gray-800 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-300 px-3">
                    <div class="flex gap-5 flex-wrap items-center">
                        {#if user.profilePicture}
                            <img
                                alt={user.username}
                                src={`${process.env.VITE_API_BASE_URL}/api/static/profile-picture/${user.id}?token=${localStorage.getItem('apiToken')}`}
                                class="w-10 rounded-full"
                            />
                        {:else}
                            <img alt={user.username} src={process.env.VITE_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
                        {/if}
                        <p>{user.username}</p>
                    </div>
                    <div class="flex gap-5">
                        {#if user.sentFriendRequest}
                            <Button
                                ariaLabel="Cancel friend request"
                                customStyle={true}
                                className="transition-colors duration-300 text-red-600 hover:text-red-500"
                                on:click={() => handleCancelFriendRequest(user)}
                            >
                                <Icon name="close" />
                            </Button>
                        {:else if user.receivedFriendRequest}
                            <div class="flex gap-5">
                                <Button
                                    ariaLabel="Accept as friend"
                                    customStyle={true}
                                    className="transition-colors duration-300 text-green-600 hover:text-green-400"
                                    on:click={() => handleAcceptPendingRequest(user)}
                                >
                                    <Icon name="confirm" />
                                </Button>
                                <Button
                                    ariaLabel="Refuse friend request"
                                    customStyle={true}
                                    className="transition-colors duration-300 text-red-600 hover:text-red-400"
                                    on:click={() => handleRefusePendingRequest(user)}
                                >
                                    <Icon name="close" />
                                </Button>
                            </div>
                        {:else}
                            <Button
                                ariaLabel="Send friend request"
                                customStyle={true}
                                className="transition-colors duration-300 text-green-600 hover:text-green-400 flex gap-1"
                                on:click={() => handleAddFriend(user)}
                            >
                                <Icon name="addUser" />
                            </Button>
                        {/if}
                        <Button ariaLabel="Block user" customStyle={true} className="transition-colors duration-300 text-red-600 hover:text-red-400" on:click={() => handleShowBlockingModal(user)}>
                            <Icon name="stop" />
                        </Button>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p class="my-5">{$t('social.friends.add.none')}</p>
    {/if}
</div>
<Pagination bind:paginatedObject={paginatedUsers} bind:baseUrl={searchBaseUrl} />

<ConfirmModal bind:showModal on:success={handleBlockUser}>
    <Subtitle slot="header">{$t('social.blocked.modal.title')}</Subtitle>
    <p>{blockingUser.username} {$t('social.blocked.modal.text')}</p>
</ConfirmModal>
