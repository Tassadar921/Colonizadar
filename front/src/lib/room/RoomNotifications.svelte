<script>
    import { transmit } from '../../stores/transmitStore.js';
    import { showToast } from '../../services/toastService.js';
    import { profile } from '../../stores/profileStore.js';
    import { location, navigate } from '../../stores/locationStore.js';
    import { onDestroy, onMount } from 'svelte';
    import { t } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';
    import { get } from 'svelte/store';

    onMount(() => {
        console.log('==> RoomNotifications mounted');
    });

    const dispatch = createEventDispatcher();
    export let room;

    let isInitialized = false;

    let roomClosedNotification;
    let playerJoinedNotification;
    let playerLeftNotification;
    let playerUpdateNotification;
    let roomStartingNotification;
    let roomStartNotification;

    let isSettingUp = false;

    const setup = async () => {
       if (isInitialized) {
            console.log('Already initialized, skipping...');
            return;
        }

        if (isSettingUp) {
            return;
        }
        isSettingUp = true;

        console.log('Setting up subscriptions for room:', room.id);
        await cleanupTransmits();
        await setupTransmits();
        setupHandlers();

        isSettingUp = false;
        isInitialized = true;
    };

    const setupTransmits = async () => {
        const transmitInstance = get(transmit);

        roomClosedNotification = transmitInstance.subscription(`notification/play/room/${room.id}/closed`);
        playerJoinedNotification = transmitInstance.subscription(`notification/play/room/${room.id}/player/joined`);
        playerLeftNotification = transmitInstance.subscription(`notification/play/room/${room.id}/player/leave`);
        playerUpdateNotification = transmitInstance.subscription(`notification/play/room/${room.id}/player/update`);
        roomStartingNotification = transmitInstance.subscription(`notification/play/room/${room.id}/starting`);
        roomStartNotification = transmitInstance.subscription(`notification/play/room/${room.id}/game/start`);

        await Promise.all([
            roomClosedNotification.create(),
            playerJoinedNotification.create(),
            playerLeftNotification.create(),
            playerUpdateNotification.create(),
            roomStartingNotification.create(),
            roomStartNotification.create(),
        ]);

        console.log('All subscriptions created.');
    };

    const setupHandlers = () => {
        

        console.log('Setting up handlers for room:', room.id);

        roomClosedNotification.onMessage(async () => {
            showToast(t('toast.notification.play.room.closed'), 'warning');
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
        });

        roomStartingNotification.onMessage(({ countdown }) => {
            console.log('Room starting countdown:', countdown);
        });

        roomStartNotification.onMessage(() => {
            console.log('Game START');
        });

        console.log('All handlers set up.');
    };

    const cleanupTransmits = async () => {
        console.log('Cleaning up subscriptions...');

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
        console.log("<== RoomNotifications destroyed");
        cleanupTransmits();
    });
</script>
