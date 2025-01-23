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
            updateUser(user.id, { friendRequested: true });
            showToast($t('toast.friends.add.success'));
        } else {
            showToast($t('toast.friends.add.error'), 'error');
        }
    };

    const handleCancelFriendRequest = async (user) => {
        const response = await axios.delete(`/api/friends/pending/cancel/${user.id}`);

        if (response.status === 200) {
            updateUser(user.id, { friendRequested: false });
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
        const acceptFriendRequest = $transmit.subscription(`notification/add-friend/accept/${$profile.id}`);
        await acceptFriendRequest.create();
        acceptFriendRequest.onMessage(async () => {
            await updateAddFriends();
            dispatch('update');
        });

        const refuseFriendRequest = $transmit.subscription(`notification/add-friend/refuse/${$profile.id}`);
        await refuseFriendRequest.create();
        refuseFriendRequest.onMessage((user) => {
            updateUser(user.id, { friendRequested: false });
        });
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
                        {#if user.friendRequested}
                            <Button
                                ariaLabel="Cancel friend request"
                                customStyle={true}
                                className="transition-colors duration-300 text-red-600 hover:text-red-500"
                                on:click={() => handleCancelFriendRequest(user)}
                            >
                                <Icon name="close" />
                            </Button>
                        {:else}
                            <Button
                                ariaLabel="Send friend request"
                                customStyle={true}
                                className="transition-colors duration-300 text-green-600 hover:text-green-500 flex gap-1"
                                on:click={() => handleAddFriend(user)}
                            >
                                <Icon name="addUser" />
                            </Button>
                        {/if}
                        <Button ariaLabel="Block user" customStyle={true} className="transition-colors duration-300 text-red-600 hover:text-red-500" on:click={() => handleShowBlockingModal(user)}>
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
