<script>
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '../shared/Search.svelte';
    import Pagination from '../shared/Pagination.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import Icon from '../shared/Icon.svelte';
    import Button from '../shared/Button.svelte';
    import { showToast } from '../../services/toastService.js';
    import Subtitle from '../shared/Subtitle.svelte';
    import ConfirmModal from '../shared/ConfirmModal.svelte';

    let paginatedBlockedUsers = { blockedUsers: [] };
    let searchBaseUrl = '/api/blocked';
    let query = '';
    let selectedBlockedUser = { username: '' };
    let showModal = false;

    onMount(async () => {
        const { data } = await axios.get(searchBaseUrl);
        paginatedBlockedUsers = data.blockedUsers;
    });

    const handleSearch = async () => {
        searchBaseUrl = `/api/blocked?${query ? `query=${query}` : ''}`;
        const response = await axios.get(searchBaseUrl);
        if (response.status === 200) {
            paginatedBlockedUsers = response.data.blockedUsers;
        } else {
            showToast($t('toast.blocked.search.error'), 'error');
        }
    };

    const handleUnblockUser = async () => {
        const response = await axios.delete(`/api/blocked/cancel/${selectedBlockedUser.id}`);
        if (response.status === 200) {
            paginatedBlockedUsers.blockedUsers = paginatedBlockedUsers.blockedUsers.filter((currentUser) => {
                return currentUser.user.id !== selectedBlockedUser.id;
            });
            showToast($t('toast.unblock.success'));
        } else {
            showToast($t('toast.unblock.error'), 'error');
        }
        showModal = false;
    };

    const handleShowUnblockModal = (user) => {
        selectedBlockedUser = user;
        showModal = true;
    };
</script>

<Title title={$t('social.blocked.title')} />

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title'), path: '/social' }, { label: $t('social.blocked.title') }]} />

<Search
    selected
    bind:results={paginatedBlockedUsers.blockedUsers}
    placeholder={$t('social.blocked.search.placeholder')}
    label={$t('social.blocked.search.label')}
    name="search-blocked"
    minChars={3}
    bind:search={query}
    on:search={handleSearch}
/>

<div class="flex flex-row flex-wrap gap-5 justify-center my-5">
    {#if paginatedBlockedUsers.blockedUsers.length}
        <div class="flex flex-col gap-1 w-full">
            {#each paginatedBlockedUsers.blockedUsers as blocked}
                <div class="flex justify-between items-center h-12 border border-gray-300 dark:border-gray-800 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-300 px-3">
                    <div class="flex gap-5 flex-wrap items-center">
                        {#if blocked.user.profilePicture}
                            <img
                                alt={blocked.user.username}
                                src={`${process.env.VITE_API_BASE_URL}/api/static/profile-picture/${blocked.user.id}?token=${localStorage.getItem('apiToken')}`}
                                class="w-10 rounded-full"
                            />
                        {:else}
                            <img alt={blocked.user.username} src={process.env.VITE_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
                        {/if}
                        <p>{blocked.user.username}</p>
                    </div>
                    <Button
                        ariaLabel="Unblock user"
                        customStyle
                        className="transition-all duration-300 hover:scale-110 transform text-green-600 hover:text-green-400"
                        on:click={() => handleShowUnblockModal(blocked.user)}
                    >
                        <Icon name="unblock" />
                    </Button>
                </div>
            {/each}
        </div>
    {:else}
        <p class="my-5">{$t('social.blocked.none')}</p>
    {/if}
</div>
<Pagination bind:paginatedObject={paginatedBlockedUsers} bind:baseUrl={searchBaseUrl} />

<ConfirmModal bind:showModal on:success={handleUnblockUser}>
    <Subtitle slot="header">{$t('social.unblock.modal.title')}</Subtitle>
    <p>{selectedBlockedUser.username} {$t('social.unblock.modal.text')}</p>
</ConfirmModal>
