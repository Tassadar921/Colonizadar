<script>
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '../shared/Search.svelte';
    import Pagination from '../shared/Pagination.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import Modal from '../shared/Modal.svelte';
    import PendingFriends from '../friends/PendingFriends.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import AddFriends from '../friends/AddFriends.svelte';
    import Button from '../shared/Button.svelte';
    import Icon from '../shared/Icon.svelte';

    let paginatedFriends = { friends: [] };
    let searchBaseUrl = '/api/friends';
    let query = '';
    let showPendingFriendsModal = false;
    let showAddFriendsModal = false;

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
    }
</script>

<div class="flex gap-3 items-center">
    <Title title={$t('social.friends.title')} />
    <Button
        ariaLabel="Add a friend"
        customStyle={true}
        className="rounded-full bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 p-1 mb-1.5"
        on:click={() => (showAddFriendsModal = true)}
    >
        <Icon name="plus" />
    </Button>
</div>

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title'), path: '/social' }, { label: $t('social.friends.title') }]} />

<Search
    selected={true}
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
                <div class="flex gap-5">
                    {#if friendObject.friend.friendRequested}
                        <Button
                            ariaLabel="Cancel friend request"
                            customStyle={true}
                            className="transition-colors duration-300 text-red-600 hover:text-red-500"
                            on:click={() => handleCancelFriendRequest(friend)}
                        >
                            <Icon name="close" />
                        </Button>
                    {:else}
                        <Button
                            ariaLabel="Send friend request"
                            customStyle={true}
                            className="transition-colors duration-300 text-green-600 hover:text-green-400 flex gap-1"
                            on:click={() => handleAddFriend(friend)}
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
        <p class="mt-5">{$t('social.friends.none')}</p>
    {/if}
</div>
<Pagination bind:paginatedObject={paginatedFriends} bind:baseUrl={searchBaseUrl} />

<Modal bind:showModal={showPendingFriendsModal} fullWidth={true}>
    <Subtitle slot="header">{$t('social.friends.pending.title')}</Subtitle>
    <PendingFriends />
</Modal>

<Modal bind:showModal={showAddFriendsModal} fullWidth={true}>
    <Subtitle slot="header">{$t('social.friends.add.title')}</Subtitle>
    <AddFriends on:update={updateFriends} />
</Modal>
