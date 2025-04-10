<script>
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '../shared/Search.svelte';
    import Pagination from '../shared/Pagination.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import AddFriends from '../friends/AddFriends.svelte';
    import Button from '../shared/Button.svelte';
    import Icon from '../shared/Icon.svelte';
    import ConfirmModal from '../shared/ConfirmModal.svelte';
    import { showToast } from '../../services/toastService.js';
    import { profile } from '../../stores/profileStore.ts';
    import { transmit } from '../../stores/transmitStore.ts';

    let paginatedFriends = { friends: [] };
    let searchBaseUrl = '/api/friends';
    let query = '';

    let selectedFriend = { username: '' };

    let showAddFriendsModal = false;
    let showConfirmRemoveFriendModal = false;
    let showBlockingModal = false;

    onMount(async () => {
        await updateFriends();
    });

    const handleSearch = async () => {
        searchBaseUrl = `/api/friends?${query ? `query=${query}` : ''}`;
        const { data } = await axios.get(searchBaseUrl);
        paginatedFriends = data.friends;
    };

    const updateFriends = async () => {
        const { data } = await axios.get(searchBaseUrl);
        paginatedFriends = data.friends;
    };

    const handleShowRemoveFriendModal = (user) => {
        selectedFriend = user;
        showConfirmRemoveFriendModal = true;
    };

    const handleRemoveFriend = async () => {
        const response = await axios.delete(`/api/friends/remove/${selectedFriend.id}`);
        if (response.status === 200) {
            paginatedFriends.friends = paginatedFriends.friends.filter((friendObject) => friendObject.friend.id !== selectedFriend.id);
            showToast($t('toast.friends.remove.success'));
            showConfirmRemoveFriendModal = false;
        }
    };

    const handleShowBlockingModal = (user) => {
        selectedFriend = user;
        showBlockingModal = true;
    };

    const handleBlockUser = async () => {
        const response = await axios.get(`/api/blocked/add/${selectedFriend.id}`);
        if (response.status === 200) {
            paginatedFriends.friends = paginatedFriends.friends.filter((friendObject) => friendObject.friend.id !== selectedFriend.id);
            showToast($t('toast.blocked.success'));
            showBlockingModal = false;
        } else {
            showToast($t('toast.blocked.error'), 'error');
        }
    };

    const setupEvents = async () => {
        // update when a friend removes us from its friends
        const removeFriend = $transmit.subscription(`notification/friend/remove/${$profile.id}`);
        await removeFriend.create();
        removeFriend.onMessage(async (user) => {
            paginatedFriends.friends = paginatedFriends.friends.filter((friendObject) => friendObject.friend.id !== user.id);
        });

        const blockFriend = $transmit.subscription(`notification/blocked/${$profile.id}`);
        await blockFriend.create();
        blockFriend.onMessage(async (user) => {
            paginatedFriends.friends = paginatedFriends.friends.filter((friendObject) => friendObject.friend.id !== user.id);
        });
    };

    $: {
        if ($profile) {
            setupEvents();
        }
    }
</script>

<div class="flex gap-3 items-center">
    <Title title={$t('social.friends.title')} />
    <Button
        ariaLabel="Add a friend"
        customStyle
        className="rounded-full bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 p-1 mb-1.5"
        on:click={() => (showAddFriendsModal = true)}
    >
        <Icon name="plus" />
    </Button>
</div>

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title'), path: '/social' }, { label: $t('social.friends.title') }]} />

<Search
    selected
    bind:results={paginatedFriends.friends}
    placeholder={$t('social.friends.search.placeholder')}
    label={$t('social.friends.search.label')}
    name="search-friend"
    bind:search={query}
    on:search={handleSearch}
/>

<div class="flex flex-row flex-wrap gap-5 justify-center my-5">
    {#if paginatedFriends.friends.length}
        <div class="flex flex-col gap-1 w-full">
            {#each paginatedFriends.friends as friendObject}
                <div class="flex justify-between items-center h-12 border border-gray-300 dark:border-gray-800 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-300 px-3">
                    <div class="flex gap-5 flex-wrap items-center">
                        {#if friendObject.friend.profilePicture}
                            <img
                                alt={friendObject.friend.username}
                                src={`${process.env.VITE_API_BASE_URL}/api/static/profile-picture/${friendObject.friend.id}?token=${localStorage.getItem('apiToken')}`}
                                class="w-10 rounded-full"
                            />
                        {:else}
                            <img alt={friendObject.friend.username} src={process.env.VITE_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
                        {/if}
                        <p>{friendObject.friend.username}</p>
                    </div>
                    <div class="flex gap-10 pr-5">
                        <Button
                            ariaLabel="Remove friend"
                            customStyle
                            className="transition-all duration-300 hover:scale-110 transform text-red-600 hover:text-red-400"
                            on:click={() => handleShowRemoveFriendModal(friendObject.friend)}
                        >
                            <Icon name="RemoveUser" />
                        </Button>
                        <Button
                            ariaLabel="Block user"
                            customStyle
                            className="transition-all duration-300 hover:scale-110 transform text-red-600 hover:text-red-400"
                            on:click={() => handleShowBlockingModal(friendObject.friend)}
                        >
                            <Icon name="stop" />
                        </Button>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p class="mt-5">{$t('social.friends.none')}</p>
    {/if}
</div>
<Pagination bind:paginatedObject={paginatedFriends} bind:baseUrl={searchBaseUrl} />

<Modal bind:showModal={showAddFriendsModal} fullWidth>
    <Subtitle slot="header">{$t('social.friends.add.title')}</Subtitle>
    <AddFriends on:updateFriends={updateFriends} />
</Modal>

<ConfirmModal bind:showModal={showConfirmRemoveFriendModal} on:success={handleRemoveFriend}>
    <Subtitle slot="header">{$t('social.friends.remove.modal.title')}</Subtitle>
    <p>{selectedFriend.username} {$t('social.friends.remove.modal.text')}</p>
</ConfirmModal>

<ConfirmModal bind:showModal={showBlockingModal} on:success={handleBlockUser}>
    <Subtitle slot="header">{$t('social.blocked.modal.title')}</Subtitle>
    <p>{selectedFriend.username} {$t('social.blocked.modal.text')}</p>
</ConfirmModal>
