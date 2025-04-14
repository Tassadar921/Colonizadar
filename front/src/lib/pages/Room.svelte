<script lang="ts">
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { showToast } from '../../services/toastService';
    import { navigate } from '../../stores/locationStore';
    import axios from 'axios';
    import Button from '../shared/Button.svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import InviteFriends from '../room/InviteFriends.svelte';
    import { onMount, onDestroy } from 'svelte';
    import AddBot from '../room/AddBot.svelte';
    import RoomNotifications from '../room/RoomNotifications.svelte';
    import RoomPlayer from '../room/RoomPlayer.svelte';
    import SelectMap from '../room/SelectMap.svelte';
    import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';
    import type SerializedPlayableCountry from 'colonizadar-backend/app/types/serialized/serialized_playable_country';
    import type SerializedMap from 'colonizadar-backend/app/types/serialized/serialized_map';
    import Copy from '../icons/Copy.svelte';
    import Invite from '../icons/Invite.svelte';
    import Loader from '../shared/Loader.svelte';

    export let roomId: string;

    interface Option {
        label: string;
        value: string;
        uri?: string;
    }

    let isLoading: boolean = true;
    let room: SerializedRoom;
    let showInviteFriendModal: boolean = false;
    let playableCountries: Option[];
    let botDifficulties: Option[];
    let maps: SerializedMap[];
    let heartbeat: NodeJS.Timeout;

    async function fetchRoomData(): Promise<void> {
        try {
            isLoading = true;
            const { data: roomData } = await axios.put(`/api/room/${roomId}/join`);
            room = roomData.room;

            const { data: playableCountriesData } = await axios.get(`/api/room/${room.map.id}/playable-countries`);
            playableCountries = playableCountriesData.map((playableCountry: SerializedPlayableCountry) => ({
                value: playableCountry.id,
                label: playableCountry.name,
                uri: `${import.meta.env.VITE_API_BASE_URL}/api/static/country-flag/${playableCountry.id}?token=${localStorage.getItem('apiToken')}`,
            }));
            isLoading = false;
        } catch (e: any) {
            showToast($t('toast.room.error'), 'error');
            await unloadCleanup();
            navigate('/play');
        }
    }

    const handleCopy = (): void => {
        navigator.clipboard.writeText(room.token);
        showToast($t('toast.copy.success'));
    };

    const unloadCleanup = async (): Promise<void> => {
        try {
            clearInterval(heartbeat);
            await axios.delete(`/api/room/${roomId}/leave`);
        } catch (e) {}
    };

    onMount((): void => {
        heartbeat = setInterval(async () => {
            try {
                await axios.patch(`/api/room/${roomId}/heartbeat`);
            } catch (e) {
                await unloadCleanup();
                navigate('/play');
            }
        }, 2000);
    });

    onDestroy(async (): Promise<void> => {
        await unloadCleanup();
    });

    $: if (roomId) {
        fetchRoomData();
    }

    $: if (room) {
        console.log(room);
    }
</script>

{#if room}
    <Title title={room.name ? room.name : $t('play.room.title')} />

    <Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('play.title'), path: '/play' }, { label: $t('play.room.title') }]} />

    {#key room?.id}
        <RoomNotifications bind:room on:close={unloadCleanup} />
    {/key}

    <div class="grid grid-cols-1 sm:grid-cols-2">
        <div class="flex justify-center h-10 text-white mt-3 text-sm px-3">
            <Button ariaLabel="Copy token" customStyle={true} className="group flex items-center px-2 hover:cursor-pointer text-black dark:text-white" on:click={handleCopy}>
                <span class="group-hover:text-primary-500 transition-all duration-300 group-hover:scale-110">{room.token}</span>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-7">
                    <Copy />
                </div>
            </Button>
        </div>
        <div class="flex justify-center mt-3">
            <Button
                ariaLabel="Invite a user"
                customStyle
                className="transition-all duration-300 hover:scale-110 transform bg-green-600 rounded-xl flex gap-3 px-4 py-2"
                on:click={() => (showInviteFriendModal = true)}
            >
                <span>{$t('play.room.invite.title')}</span>
                <Invite />
            </Button>
        </div>
    </div>

    <div class="flex flex-row flex-wrap gap-5 justify-center my-5">
        <div class="flex flex-col gap-1 w-full">
            {#each room.players as player}
                <RoomPlayer bind:room {player} bind:playableCountries bind:botDifficulties />
            {/each}
            <div class="w-full flex mt-5 px-5">
                <AddBot bind:room bind:difficulties={botDifficulties} />
            </div>
        </div>
    </div>

    <!-- TODO: finish map selector maybe with map thumbnail, description, ... -->
    <SelectMap bind:room bind:maps />

    <Modal bind:showModal={showInviteFriendModal} fullWidth>
        <Subtitle slot="header">{$t('play.room.invite.title')}</Subtitle>
        <InviteFriends bind:room />
    </Modal>
{:else}
    <Loader bind:isLoading />
{/if}
