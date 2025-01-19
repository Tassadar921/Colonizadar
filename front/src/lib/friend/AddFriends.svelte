<script>
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Pagination from '../shared/Pagination.svelte';
    import { showToast } from '../../services/toastService.js';
    import { transmit } from '../../stores/TransmitStore.js';
    import { profile } from '../../stores/profileStore.js';
    import Search from "../shared/Search.svelte";

    let paginatedUsers = { users: [] };
    let searchBaseUrl = '/api/friends/add';
    let query = '';

    onMount(async () => {
        const { data } = await axios.get(searchBaseUrl);
        paginatedUsers = data.users;
        console.log(paginatedUsers.users);

        const friendRequest = $transmit.subscription(`friend-request/${$profile.id}`);
        await friendRequest.create();
        friendRequest.onMessage((request) => {
            showToast(request.message, 'warning');
        });
    });

    const handleSearch = async () => {
        searchBaseUrl = `/api/friends/add?query=${query}`;
        const { data } = await axios.get(searchBaseUrl);
        paginatedUsers = data.users;
    };
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

<div class="flex flex-row flex-wrap gap-5 justify-center">
    {#if paginatedUsers.users.length}
        {#each paginatedUsers.users as user}
            <p>{user.username}</p>
        {/each}
    {:else}
        <p class="my-5">{$t('social.friends.add.none')}</p>
    {/if}
</div>
<Pagination bind:paginatedObject={paginatedUsers} bind:baseUrl={searchBaseUrl} />
