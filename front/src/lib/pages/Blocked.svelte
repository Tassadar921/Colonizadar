<script>
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '../shared/Search.svelte';
    import Pagination from '../shared/Pagination.svelte';
    import Breadcrumbs from "../shared/Breadcrumbs.svelte";

    let paginatedBlockedUsers = { blockedUsers: [] };
    let searchBaseUrl = '/api/blocked';
    let query = '';

    onMount(async () => {
        const { data } = await axios.get(searchBaseUrl);
        paginatedBlockedUsers = data.blockedUsers;
    });

    const handleSearch = async () => {
        try {
            searchBaseUrl = `/api/blocked?query=${query}`;
            const { data } = await axios.get(searchBaseUrl);
            paginatedBlockedUsers = data.blockedUsers;
        } catch (e) {
            showToast($t('toast.editor.search.error'), 'error');
        }
    };
</script>

<Title title={$t('social.blocked.title')} />

<Breadcrumbs items={[
    { label: $t('home.title'), path:'/' },
    { label: $t('social.title'), path: '/social' },
    { label: $t('social.blocked.title') },
]} />

<Search
    selected={true}
    bind:results={paginatedBlockedUsers.blockedUsers}
    placeholder={$t('social.blocked.search.placeholder')}
    label={$t('social.blocked.search.label')}
    name="search-blocked"
    minChars={3}
    bind:search={query}
    on:search={handleSearch}
/>

<div class="flex flex-row flex-wrap gap-5 justify-center">
    {#each paginatedBlockedUsers.blockedUsers as blockedUser}
        <p>{blockedUser.user.username}</p>
    {/each}
</div>
<Pagination bind:paginatedObject={paginatedBlockedUsers} bind:baseUrl={searchBaseUrl} />
