<script>
    import { transmit } from '../../stores/transmitStore.js';
    import { showToast } from '../../services/toastService.js';
    import { profile } from '../../stores/profileStore.js';
    import { location, navigate } from '../../stores/locationStore.js';
    import { onDestroy } from 'svelte';
    import { t } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';
    import { get } from 'svelte/store';

    const dispatch = createEventDispatcher();
    export let room;

    let isInitialized = false;

    let roomClosedNotification;
    let playerJoinedNotification;
    let playerLeftNotification;
    let playerUpdateNotification;
    let roomStartingNotification;
    let roomStartNotification;

    const setup = async () => {
        if (isInitialized) {
            return;
        }

        await cleanupTransmits();
        await setupTransmits();
        setupHandlers();

        isInitialized = true;
    };

    const setupTransmits = async () => {
        roomClosedNotification = $transmit.subscription(`notification/play/room/${room.id}/closed`);
        playerJoinedNotification = $transmit.subscription(`notification/play/room/${room.id}/player/joined`);
        playerLeftNotification = $transmit.subscription(`notification/play/room/${room.id}/player/leave`);
        playerUpdateNotification = $transmit.subscription(`notification/play/room/${room.id}/player/update`);
        roomStartingNotification = $transmit.subscription(`notification/play/room/${room.id}/starting`);
        roomStartNotification = $transmit.subscription(`notification/play/room/${room.id}/game/start`);

        await Promise.all([
            roomClosedNotification.create(),
            playerJoinedNotification.create(),
            playerLeftNotification.create(),
            playerUpdateNotification.create(),
            roomStartingNotification.create(),
            roomStartNotification.create(),
        ]);
    };

    const setupHandlers = () => {
        roomClosedNotification.onMessage(async () => {
            showToast($t('toast.notification.play.room.closed'), 'warning');
            dispatch('close');
            if (get(location).includes('/play/room')) {
                navigate('/play');
            }
        });

        playerJoinedNotification.onMessage((data) => {
            if (!room.players.some((player) => player.id === data.player.id)) {
                room.players = [...room.players, data.player];
            }
        });

        playerLeftNotification.onMessage((data) => {
            if (data.player.bot || (data.player && data.player.user.id !== get(profile).id)) {
                room.players = room.players.filter((player) => player.id !== data.player.id);
            }
        });

        playerUpdateNotification.onMessage(({ player }) => {
            room.players = room.players.map((p) => (p.id === player.id ? player : p));
            room.players = room.players.map((player) => (player = { ...player, isReady: false }));
        });

        roomStartingNotification.onMessage(({ countdown }) => {
            showToast(countdown);
        });

        roomStartNotification.onMessage((data) => {
            showToast(data.message);
            navigate(`/play/game/${data.gameId}`);
        });
    };

    const cleanupTransmits = async () => {
        try {
            await Promise.all([
                roomClosedNotification?.delete().then(() => console.log('roomClosedNotification deleted')),
                playerJoinedNotification?.delete().then(() => console.log('playerJoinedNotification deleted')),
                playerLeftNotification?.delete().then(() => console.log('playerLeftNotification deleted')),
                playerUpdateNotification?.delete().then(() => console.log('playerUpdateNotification deleted')),
                roomStartingNotification?.delete().then(() => console.log('roomStartingNotification deleted')),
                roomStartNotification?.delete().then(() => console.log('roomStartNotification deleted')),
            ]);
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    };

    $: if (room?.id) {
        setup();
    }

    onDestroy(() => {
        cleanupTransmits();
    });
</script>
