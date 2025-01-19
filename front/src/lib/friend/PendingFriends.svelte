<script>
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Pagination from '../shared/Pagination.svelte';
    import { showToast } from '../../services/toastService.js';
    import { transmit } from '../../stores/TransmitStore.js';

    let paginatedPendingFriends = { pendingFriends: [] };
    let searchBaseUrl = '/api/friends/pending';

    onMount(async () => {
        const { data } = await axios.get(searchBaseUrl);
        paginatedPendingFriends = data.pendingFriends;

        const friendRequest = $transmit.subscription(`friend-request/${localStorage.getItem('apiToken')}`);
        await friendRequest.create();
        friendRequest.onMessage((request) => {
            showToast(request.message, 'warning');
        });
    });
</script>

<div class="flex flex-row flex-wrap gap-5 justify-center">
    {#if paginatedPendingFriends.pendingFriends.length}
        {#each paginatedPendingFriends.pendingFriends as pendingFriend}
            <p>{pendingFriend.friend.username}</p>
        {/each}
    {:else}
        <p class="my-5">{$t('social.friends.pending.none')}</p>
    {/if}
</div>
<Pagination bind:paginatedObject={paginatedPendingFriends} bind:baseUrl={searchBaseUrl} />
