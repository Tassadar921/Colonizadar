<script lang="ts">
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '../shared/Search.svelte';
    import Pagination from '../shared/Pagination.svelte';
    import Button from '../shared/Button.svelte';
    import { profile } from '../../stores/profileStore';
    import { transmit } from '../../stores/transmitStore';
    import { showToast } from '../../services/toastService';
    import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';
    import type PaginatedFriends from 'colonizadar-backend/app/types/paginated/paginated_friends';
    import type SerializedUser from 'colonizadar-backend/app/types/serialized/serialized_user';
    import Invite from '../icons/Invite.svelte';
    import Loader from '../shared/Loader.svelte';

    export let room: SerializedRoom;

    let isLoading: boolean = false;
    let paginatedFriends: PaginatedFriends;
    let searchBaseUrl: string = '/api/friends';
    let query: string = '';

    onMount(async (): Promise<void> => {
        await updateFriends();
    });

    const handleSearch = async (): Promise<void> => {
        searchBaseUrl = `/api/friends?${query ? `query=${query}` : ''}`;
        const { data } = await axios.get(searchBaseUrl);
        paginatedFriends = data.friends;
    };

    const updateFriends = async (): Promise<void> => {
        const { data } = await axios.get(searchBaseUrl);
        paginatedFriends = data.friends;
    };

    const handleInviteFriend = async (user: SerializedUser): Promise<void> => {
        try {
            const response = await axios.post(`/api/room/${room.id}/invite`, {
                userId: user.id,
            });
            if (response.status === 200) {
                showToast($t(`${user.username} ${$t('toast.invite.success')}`));
            } else {
                showToast($t('toast.invite.error'));
            }
        } catch (e) {
            showToast($t('toast.invite.error'));
        }
    };

    const setupEvents = async (): Promise<void> => {
        // update when a friend removes us from its friends
        const removeFriend = $transmit.subscription(`notification/friend/remove/${$profile!.id}`);
        await removeFriend.create();
        removeFriend.onMessage(async (user: SerializedUser): Promise<void> => {
            paginatedFriends.friends = paginatedFriends.friends.filter((friendObject) => friendObject.friend.id !== user.id);
        });

        // update when a friend blocks user
        const blockFriend = $transmit.subscription(`notification/blocked/${$profile!.id}`);
        await blockFriend.create();
        blockFriend.onMessage(async (user: SerializedUser): Promise<void> => {
            paginatedFriends.friends = paginatedFriends.friends.filter((friendObject) => friendObject.friend.id !== user.id);
        });
    };

    $: {
        if ($profile) {
            setupEvents();
        }
    }
</script>

{#if paginatedFriends}
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
                    <div
                        class="flex justify-between items-center h-12 border border-gray-300 dark:border-gray-800 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-300 px-3"
                    >
                        <div class="flex gap-5 flex-wrap items-center">
                            {#if friendObject.friend.profilePicture}
                                <img
                                    alt={friendObject.friend.username}
                                    src={`${import.meta.env.VITE_API_BASE_URL}/api/static/profile-picture/${friendObject.friend.id}?token=${localStorage.getItem('apiToken')}`}
                                    class="w-10 rounded-full"
                                />
                            {:else}
                                <img alt={friendObject.friend.username} src={import.meta.env.VITE_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
                            {/if}
                            <p>{friendObject.friend.username}</p>
                        </div>
                        <div class="flex gap-10 pr-5">
                            {#if !room.players.some((player) => player.user && player.user.id === friendObject.friend.id)}
                                <Button
                                    ariaLabel="Invite a friend"
                                    customStyle
                                    className="transition-all duration-300 hover:scale-110 transform text-green-600 hover:text-green-400"
                                    on:click={() => handleInviteFriend(friendObject.friend)}
                                >
                                    <Invite />
                                </Button>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="mt-5">{$t('social.friends.none')}</p>
        {/if}
    </div>
    <Pagination bind:paginatedObject={paginatedFriends} bind:baseUrl={searchBaseUrl} />
{:else}
    <Loader bind:isLoading />
{/if}
