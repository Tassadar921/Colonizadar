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
    import Loader from '../shared/Loader.svelte';
    import RoomReady from '../room/RoomReady.svelte';
    import PlayableCountriesInfo from '../room/PlayableCountriesInfo.svelte';
    import Icon from '../shared/Icon.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import { profile } from '../../stores/profileStore';

    export let roomId: string;

    interface Option {
        label: string;
        value: string;
        uri?: string;
    }

    let currentPlayer: SerializedRoomPlayer;

    let isLoading: boolean = true;
    let room: SerializedRoom;
    let showInviteFriendModal: boolean = false;

    let playableCountries: SerializedPlayableCountry[];
    let playableCountriesOptions: Option[];

    let botDifficulties: Option[];

    let maps: SerializedMap[];
    let heartbeat: NodeJS.Timeout;
    let hasLastHeartbeatFailed: boolean = false;

    async function fetchRoomData(): Promise<void> {
        try {
            isLoading = true;
            const { data: roomData } = await axios.put(`/api/room/${roomId}/join`);
            room = roomData.room;

            const { data: playableCountriesData } = await axios.get(`/api/room/${room.map.id}/playable-countries`);
            playableCountries = playableCountriesData;
            playableCountriesOptions = playableCountriesData.map((playableCountry: SerializedPlayableCountry) => ({
                value: playableCountry.id,
                label: playableCountry.name,
                uri: `${import.meta.env.VITE_API_BASE_URL}/api/static/country-flag/${playableCountry.id}?token=${localStorage.getItem('apiToken')}`,
            }));
            isLoading = false;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
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
        } catch (e) {}
    };

    onMount((): void => {
        heartbeat = setInterval(async () => {
            try {
                await axios.patch(`/api/room/${roomId}/heartbeat`);
                hasLastHeartbeatFailed = false;
            } catch (e) {
                if (hasLastHeartbeatFailed) {
                    navigate('/play');
                } else {
                    hasLastHeartbeatFailed = true;
                }
            }
        }, 2000);
    });

    onDestroy((): void => {
        clearInterval(heartbeat);
    });

    $: if (roomId) {
        fetchRoomData();
    }

    $: currentPlayer = room?.players.find((player: SerializedRoomPlayer): boolean => player.user?.id === $profile!.id);
</script>

<MetaTags
    title={$t('play.room.meta.title')}
    description={$t('play.room.meta.description')}
    keywords={$t('play.room.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/play/room/${roomId}`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/play/room/${roomId}`,
        },
    ]}
/>

{#if room}
    <Title title={room.name ? room.name : $t('play.room.title')} />

    <Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('play.title'), path: '/play' }, { label: $t('play.room.title') }]} />

    {#key room?.id}
        <RoomNotifications bind:room on:close={unloadCleanup} />
    {/key}

    <div class="grid grid-cols-1 sm:grid-cols-2">
        <div class="flex justify-center h-10 text-white mt-3 text-sm px-3">
            <Button ariaLabel="Copy token" customStyle={true} className="group flex items-center px-2 text-black dark:text-white" on:click={handleCopy}>
                <span class="group-hover:text-primary-500 transition-all duration-300 group-hover:scale-110">{room.token}</span>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-7">
                    <Icon name="copy" />
                </div>
            </Button>
        </div>
        <div class="flex justify-center mt-3 gap-x-4">
            <Button
                ariaLabel="Invite a user"
                customStyle
                className="transition-all duration-300 hover:scale-110 transform bg-green-600 rounded-xl flex gap-3 px-4 py-2"
                on:click={() => (showInviteFriendModal = true)}
            >
                <span>{$t('play.room.invite.title')}</span>
                <Icon name="invite" />
            </Button>
            <RoomReady bind:room bind:currentPlayer />
        </div>
    </div>

    <div class="flex my-10">
        <PlayableCountriesInfo bind:playableCountries />
    </div>

    <div class="flex flex-row flex-wrap gap-5 justify-center my-10">
        <div class="flex flex-col gap-1 w-full">
            {#each room.players as player}
                <RoomPlayer bind:room bind:player bind:playableCountries={playableCountriesOptions} bind:botDifficulties />
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
    <Loader {isLoading} />
{/if}
