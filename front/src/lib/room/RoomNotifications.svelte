<script lang="ts">
    import { transmit } from '../../stores/transmitStore';
    import { showToast } from '../../services/toastService';
    import { profile } from '../../stores/profileStore';
    import { location, navigate } from '../../stores/locationStore';
    import { onDestroy } from 'svelte';
    import { t } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';
    import { get } from 'svelte/store';
    import type { Subscription } from '@adonisjs/transmit-client';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';
    import { clearMoves } from '../../stores/dbStore';

    const dispatch = createEventDispatcher();

    export let room: SerializedRoom;

    let isInitialized = false;

    let roomClosedNotification: Subscription;
    let playerJoinedNotification: Subscription;
    let playerLeftNotification: Subscription;
    let playerUpdateNotification: Subscription;
    let roomStartingNotification: Subscription;
    let roomStartNotification: Subscription;

    const setup = async (): Promise<void> => {
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

    const setupHandlers = (): void => {
        roomClosedNotification.onMessage(async (): Promise<void> => {
            showToast($t('toast.notification.play.room.closed'), 'warning');
            dispatch('close');
            if (get(location).includes('/play/room')) {
                navigate('/play');
            }
        });

        playerJoinedNotification.onMessage(({ player }: { player: SerializedRoomPlayer }): void => {
            if (!room.players.some((p: SerializedRoomPlayer) => p.id === player.id)) {
                room = { ...room, players: [...room.players, player] };
            }
        });

        playerLeftNotification.onMessage(({ player }: { player: SerializedRoomPlayer }): void => {
            if (player.bot || (player && player.user.id !== $profile!.id)) {
                room = { ...room, players: room.players.filter((roomPlayer: SerializedRoomPlayer) => roomPlayer.id !== player.id) };
            } else if (player.user.id === $profile!.id) {
                navigate('/play');
            }
        });

        playerUpdateNotification.onMessage(({ player }: { player: SerializedRoomPlayer }): void => {
            room.players = room.players.map((p: SerializedRoomPlayer) => (p.id === player.id ? { ...p, ...player } : p));
        });

        roomStartingNotification.onMessage(({ countdown }: { countdown: number }): void => {
            showToast(`${countdown}`);
        });

        roomStartNotification.onMessage(({ message, gameId }: { message: string; gameId: number }): void => {
            showToast(message);
            clearMoves();
            navigate(`/play/game/${gameId}`);
        });
    };

    const cleanupTransmits = async (): Promise<void> => {
        try {
            await Promise.all([
                roomClosedNotification?.delete(),
                playerJoinedNotification?.delete(),
                playerLeftNotification?.delete(),
                playerUpdateNotification?.delete(),
                roomStartingNotification?.delete(),
                roomStartNotification?.delete(),
            ]);
        } catch (error: any) {
            console.error('Error during cleanup:', error);
        }
    };

    $: if (room.id) {
        setup();
    }

    onDestroy(() => {
        cleanupTransmits();
    });
</script>
