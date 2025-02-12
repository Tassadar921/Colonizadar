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
    let kickedNotification;
    let userJoinedNotification;
    let userLeftNotification;

    async function setupTransmits() {
        if (!room.id) return;

        await cleanupTransmits();

        roomClosedNotification = $transmit.subscription(`notification/play/room/${room.id}/closed`);
        kickedNotification = $transmit.subscription(`notification/play/room/${room.id}/${$profile.id}/kicked`);
        userJoinedNotification = $transmit.subscription(`notification/play/room/${room.id}/joined`);
        userLeftNotification = $transmit.subscription(`notification/play/room/${room.id}/leave`);

        await roomClosedNotification.create();
        roomClosedNotification.onMessage(async () => {
            showToast($t('toast.notification.play.room.closed'), 'warning');
            await resetTransmits();
            if ($location.includes('/play/room')) {
                navigate('/play');
            }
        });

        await userJoinedNotification.create();
        userJoinedNotification.onMessage((data) => {
            if (!room.players.some((player) => player.id === data.player.id)) {
                room.players = [...room.players, data.player];
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
    }

    async function cleanupTransmits() {
        await roomClosedNotification?.delete();
        await kickedNotification?.delete();
        await userJoinedNotification?.delete();
        await userLeftNotification?.delete();
    }

    $: if (room.id) {
        setupTransmits();
    }

    onDestroy(() => {
        cleanupTransmits();
    });
</script>
