<script>
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '../shared/Search.svelte';
    import Pagination from '../shared/Pagination.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';

    let paginatedFriends = { friends: [] };
    let searchBaseUrl = '/api/friends';
    let query = '';

    onMount(async () => {
        const { data } = await axios.get(searchBaseUrl);
        paginatedFriends = data.friends;
    });

    const handleSearch = async () => {
        try {
            searchBaseUrl = `/api/friends?query=${query}`;
            const { data } = await axios.get(searchBaseUrl);
            paginatedFriends = data.friends;
        } catch (e) {
            showToast($t('toast.editor.search.error'), 'error');
        }
    };
</script>

<Title title={$t('social.friends.title')} />

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title'), path: '/social' }, { label: $t('social.friends.title') }]} />

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
    {#each paginatedFriends.friends as friend}
        <p>{friend.friend.username}</p>
    {/each}
</div>
<Pagination bind:paginatedObject={paginatedFriends} bind:baseUrl={searchBaseUrl} />
