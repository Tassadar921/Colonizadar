<script>
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '../shared/Search.svelte';
    import Pagination from '../shared/Pagination.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import Modal from '../shared/Modal.svelte';
    import PendingFriends from '../friend/PendingFriends.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import AddFriends from "../friend/AddFriends.svelte";
    import IconButton from "../shared/IconButton.svelte";

    let paginatedFriends = { friends: [] };
    let searchBaseUrl = '/api/friends';
    let query = '';
    let showPendingFriendsModal = false;
    let showAddFriendsModal = false;

    onMount(async () => {
        const { data } = await axios.get(searchBaseUrl);
        paginatedFriends = data.friends;
    });

    const handleSearch = async () => {
        searchBaseUrl = `/api/friends?query=${query}`;
        const { data } = await axios.get(searchBaseUrl);
        paginatedFriends = data.friends;
    };
</script>

<Title title={$t('social.friends.title')} />

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title'), path: '/social' }, { label: $t('social.friends.title') }]} />

<IconButton icon="plus" on:click={() => showAddFriendsModal = true } />

<Search
    selected={true}
    bind:results={paginatedFriends.friends}
    placeholder={$t('social.friends.search.placeholder')}
    label={$t('social.friends.search.label')}
    name="search-friend"
    minChars={3}
    bind:search={query}
    on:search={handleSearch}
/>

<div class="flex flex-row flex-wrap gap-5 justify-center">
    {#if paginatedFriends.friends.length}
        {#each paginatedFriends.friends as friend}
            <p>{friend.friend.username}</p>
        {/each}
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
    <AddFriends />
</Modal>
