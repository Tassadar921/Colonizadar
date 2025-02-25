<script>
    import { transmit } from '../../stores/transmitStore.js';
    import { showToast } from '../../services/toastService.js';
    import { profile } from '../../stores/profileStore.js';
    import { location } from '../../stores/locationStore.js';
    import { navigate } from '../../stores/locationStore.js';
    import { onDestroy } from 'svelte';
    import { t } from 'svelte-i18n';

    export let room;
    export let resetTransmits;

    let roomClosedNotification;
    let playerJoinedNotification;
    let playerLeftNotification;
    let playerUpdateNotification;

    const setupTransmits = async () => {
        await cleanupTransmits();

        roomClosedNotification = $transmit.subscription(`notification/play/room/${room.id}/closed`);
        playerJoinedNotification = $transmit.subscription(`notification/play/room/${room.id}/player/joined`);
        playerLeftNotification = $transmit.subscription(`notification/play/room/${room.id}/player/leave`);
        playerUpdateNotification = $transmit.subscription(`notification/play/room/${room.id}/player/update`);

        await roomClosedNotification.create();
        roomClosedNotification.onMessage(async () => {
            showToast($t('toast.notification.play.room.closed'), 'warning');
            await resetTransmits();
            if ($location.includes('/play/room')) {
                navigate('/play');
            }
        });

        await playerJoinedNotification.create();
        playerJoinedNotification.onMessage((data) => {
            if (!room.players.some((player) => player.id === data.player.id)) {
                room.players = [...room.players, data.player];
            }
        });

        await playerLeftNotification.create();
        playerLeftNotification.onMessage((data) => {
            if (data.player.bot || (data.player && data.player.user.id !== $profile.id)) {
                room.players = room.players.filter((player) => player.id !== data.player.id);
            }
        });

        await playerUpdateNotification.create();
        playerUpdateNotification.onMessage(({ player }) => {
            room.players = room.players.map((p) => {
                if (p.id === player.id) {
                    return player;
                }
                return p;
            });
        });
    };

    const cleanupTransmits = async () => {
        await roomClosedNotification?.delete();
        await playerJoinedNotification?.delete();
        await playerLeftNotification?.delete();
    };

    $: if (room.id) {
        setupTransmits();
    }

    onDestroy(() => {
        cleanupTransmits();
    });
</script>
