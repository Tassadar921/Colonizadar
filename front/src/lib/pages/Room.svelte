<script>
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { showToast } from '../../services/toastService.js';
    import { navigate } from '../../stores/locationStore.js';
    import { profile } from '../../stores/profileStore.js';
    import axios from 'axios';
    import Button from '../shared/Button.svelte';
    import Icon from '../shared/Icon.svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import InviteFriends from '../room/InviteFriends.svelte';
    import { transmit } from '../../stores/transmitStore.js';
    import {onDestroy} from "svelte";

    export let roomId;

    let room = { name: '', players: [] };
    let showInviteFriendModal = false;

    const roomClosedNotification = $transmit.subscription(`notification/play/room/${room.id}/closed`);
    const kickedNotification = $transmit.subscription(`notification/play/room/${room.id}/${$profile.id}/kicked`);
    const userJoinedNotification = $transmit.subscription(`notification/play/room/${room.id}/joined`);
    const userLeftNotification = $transmit.subscription(`notification/play/room/${room.id}/leave`);

    async function fetchRoomData() {
        try {
            const response = await axios.get(`/api/room/${roomId}/joined`);
            if (response.status === 200) {
                room = response.data.room;

                await roomClosedNotification.create();
                roomClosedNotification.onMessage(() => {
                    showToast($t(''), 'warning');
                    navigate('/play');
                });

                await userJoinedNotification.create();
                userJoinedNotification.onMessage((data) => {
                    if (!room.players.some((player) => player.user.id === data.user.id)) {
                        room.players = [...room.players, { user: data.user }];
                        showToast(`${data.user.username} ${$t('toast.notification.play.room.joined')}`);
                    }
                });

                await userLeftNotification.create();
                userLeftNotification.onMessage((data) => {
                    if (data.user.id !== $profile.id) {
                        room.players = room.players.filter((player) => player.user.id !== data.user.id);
                        showToast(`${data.user.username} ${$t('toast.notification.play.room.left')}`, 'warning');
                    }
                });
            } else {
                showToast($t('toast.room.error'), 'error');
                navigate('/play');
            }
        } catch (e) {
            showToast($t('toast.room.error'), 'error');
            navigate('/play');
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(room.token);
        showToast($t('toast.copy.success'));
    };

    const handleKick = async (user) => {
        // TODO : handle kick user
        // try {
        //     await axios.post(`/api/room/${roomId}/kick`, { userId: user.id });
        //     showToast(`${user.username} ${$t('toast.notification.play.room.kicked')}`);
        //     room.players = room.players.filter((p) => p.user.id !== user.id);
        // } catch (error) {
        //     showToast($t('toast.room.kick.error'), 'error');
        // }
    };

    onDestroy(async () => {
        await axios.delete(`/api/room/${roomId}/leave`);
        await userJoinedNotification.delete();
        await userLeftNotification.delete();
    });

    $: if (roomId) {
        fetchRoomData();
    }
</script>

<Title title={room.name ? room.name : $t('play.room.title')} />

<Breadcrumbs items={[
    { label: $t('home.title'), path: '/' },
    { label: $t('play.title'), path: '/play' },
    { label: $t('play.room.title') }
]} />

<div class="grid grid-cols-1 sm:grid-cols-2">
    <div class="flex justify-center h-10 text-white mt-3 text-sm px-3">
        <Button ariaLabel="Copy token" customStyle={true}
                className="group flex items-center px-2 hover:cursor-pointer text-black dark:text-white"
                on:click={handleCopy}>
            <span class="group-hover:text-primary-500 transition-all duration-300 group-hover:scale-110">{room.token}</span>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-7">
                <Icon name="copy" />
            </div>
        </Button>
    </div>
    <div class="flex justify-center mt-3">
        <Button ariaLabel="Invite a user" customStyle
                className="transition-all duration-300 hover:scale-110 transform bg-green-600 rounded-xl flex gap-3 px-4 py-2"
                on:click={() => (showInviteFriendModal = true)}>
            <span>{$t('play.room.invite.title')}</span>
            <Icon name="invite" />
        </Button>
    </div>
</div>

<div class="flex flex-row flex-wrap gap-5 justify-center my-5">
    <div class="flex flex-col gap-1 w-full">
        {#each room.players as player}
            <div class="relative flex justify-between items-center h-12 border border-gray-300 dark:border-gray-800 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-300 px-3">
                <div class="flex gap-5 flex-wrap items-center">
                    {#if player.user.profilePicture}
                        <img alt={player.user.username}
                             src={`${process.env.VITE_API_BASE_URL}/api/static/profile-picture/${player.user.id}?token=${localStorage.getItem('apiToken')}`}
                             class="w-10 rounded-full" />
                    {:else}
                        <img alt={player.user.username} src={process.env.VITE_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
                    {/if}
                    <p>{player.user.username}</p>
                    {#if room.owner.id === player.user.id}
                        <div class="text-yellow-500">
                            <Icon name="crown" />
                        </div>
                    {/if}
                </div>
                {#if $profile.id === room.owner.id && $profile.id !== player.user.id}
                    <div>
                        <Button ariaLabel="Kick user from room" customStyle
                                className="transition-all duration-300 hover:scale-110 transform text-red-600 hover:text-red-400"
                                on:click={() => handleKick(player.user)}>
                            <Icon name="close" />
                        </Button>
                    </div>
                {/if}
<!--                <div class="absolute w-full h-full rounded-xl bg-gray-200 dark:bg-gray-800 opacity-30"></div>-->
            </div>
        {/each}
    </div>
</div>

<Modal bind:showModal={showInviteFriendModal} fullWidth>
    <Subtitle slot="header">{$t('play.room.invite.title')}</Subtitle>
    <InviteFriends {room} />
</Modal>
