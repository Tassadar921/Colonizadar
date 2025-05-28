<script lang="ts">
    import { transmit } from '../../stores/transmitStore';
    import { createEventDispatcher, onDestroy } from 'svelte';
    import type { Subscription } from '@adonisjs/transmit-client';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import { showToast } from '../../services/toastService';
    import { t } from 'svelte-i18n';
    import { formatGameNumbers } from '../../services/stringService';
    import axios from 'axios';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import { handleFortifyAction } from '../../services/gameGeometryService';

    const dispatch = createEventDispatcher();

    export let game: SerializedGame;
    export let currentPlayer: SerializedRoomPlayer;

    let isInitialized = false;

    let gameUpdateNotification: Subscription;
    let playerUpdateNotification: Subscription;
    let territoryUpdateNotification: Subscription;
    let spiedNotification: Subscription;
    let warNotification: Subscription;
    let askPeaceNotification: Subscription;
    let refusePeaceNotification: Subscription;
    let cancelPendingPeaceNotification: Subscription;
    let peaceNotification: Subscription;
    let financedNotification: Subscription;
    let nextTurnNotification: Subscription;

    const getCurrentPlayer = async (): Promise<SerializedRoomPlayer> => {
        try {
            const { data } = await axios.get(`/api/game/${game.id}/player`);
            return data;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
            return currentPlayer;
        }
    };

    const updatePlayersInGame = async (playersToUpdate: SerializedRoomPlayer[]): Promise<void> => {
        const shouldRefreshCurrent: boolean = playersToUpdate.some((updatePlayer: SerializedRoomPlayer): boolean => updatePlayer.id === currentPlayer.id);

        const updatedPlayers = await Promise.all(
            game.players.map(async (loopPlayer: SerializedRoomPlayer): Promise<SerializedRoomPlayer> => {
                const updated = playersToUpdate.find((updatePlayer: SerializedRoomPlayer): boolean => updatePlayer.id === loopPlayer.id);

                if (updated === undefined) {
                    return loopPlayer;
                }

                if (loopPlayer.id === currentPlayer.id && shouldRefreshCurrent) {
                    currentPlayer = await getCurrentPlayer();
                    return currentPlayer;
                }

                return updated;
            })
        );

        game = {
            ...game,
            players: updatedPlayers,
        };
    };

    const setup = async (): Promise<void> => {
        if (isInitialized === true) {
            return;
        }

        await cleanupTransmits();
        await setupTransmits();
        setupHandlers();
        isInitialized = true;
    };

    const setupTransmits = async (): Promise<void> => {
        gameUpdateNotification = $transmit.subscription(`notification/play/game/${game.id}/update`);
        playerUpdateNotification = $transmit.subscription(`notification/play/game/${game.id}/player/update`);
        territoryUpdateNotification = $transmit.subscription(`notification/play/game/${game.id}/territory/update`);
        spiedNotification = $transmit.subscription(`notification/play/game/${game.id}/${currentPlayer.id}/spied`);
        warNotification = $transmit.subscription(`notification/play/game/${game.id}/war`);
        askPeaceNotification = $transmit.subscription(`notification/play/game/${game.id}/${currentPlayer.id}/peace/ask`);
        refusePeaceNotification = $transmit.subscription(`notification/play/game/${game.id}/${currentPlayer.id}/peace/refuse`);
        cancelPendingPeaceNotification = $transmit.subscription(`notification/play/game/${game.id}/${currentPlayer.id}/peace/cancel`);
        peaceNotification = $transmit.subscription(`notification/play/game/${game.id}/peace`);
        financedNotification = $transmit.subscription(`notification/play/game/${game.id}/${currentPlayer.id}/financed`);
        nextTurnNotification = $transmit.subscription(`notification/play/game/${game.id}/next-turn`);

        await Promise.all([
            gameUpdateNotification.create(),
            playerUpdateNotification.create(),
            territoryUpdateNotification.create(),
            spiedNotification.create(),
            warNotification.create(),
            askPeaceNotification.create(),
            refusePeaceNotification.create(),
            cancelPendingPeaceNotification.create(),
            peaceNotification.create(),
            financedNotification.create(),
            nextTurnNotification.create(),
        ]);
    };

    const setupHandlers = (): void => {
        gameUpdateNotification.onMessage(({ game: newGame }: { game: SerializedGame }): void => {
            game = newGame;
        });

        playerUpdateNotification.onMessage(async ({ player }: { player: SerializedRoomPlayer }): Promise<void> => {
            await updatePlayersInGame([player]);
        });

        territoryUpdateNotification.onMessage(async ({ territory: updatedTerritory }: { territory: SerializedGameTerritory }): Promise<void> => {
            if (updatedTerritory.owner?.id === currentPlayer.id) {
                try {
                    const { data } = await axios.get(`/api/game/${game.id}/territory/${updatedTerritory.territory.code}`);
                    updatedTerritory = data;
                } catch (error: any) {
                    showToast(error.response.data.error ?? 'Failed to fetch territory', 'error');
                }
            }

            game = {
                ...game,
                territories: game.territories.map((existingTerritory: SerializedGameTerritory): SerializedGameTerritory => {
                    if (existingTerritory.id === updatedTerritory.id) {
                        if (updatedTerritory.isFortified) {
                            handleFortifyAction(game, updatedTerritory);
                        }
                        dispatch('territoryUpdate', updatedTerritory);
                        return updatedTerritory;
                    }

                    return existingTerritory;
                }),
            };
        });

        spiedNotification.onMessage(({ player }: { player: SerializedRoomPlayer }): void => {
            showToast(`${$t('play.game.spied-by')} ${player.user?.username ?? player.bot.name}`, 'warning');
        });

        warNotification.onMessage(async ({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): Promise<void> => {
            await updatePlayersInGame([player, targetPlayer]);

            if (currentPlayer.id === player.id) {
                return;
            }

            if (currentPlayer.id === targetPlayer.id) {
                showToast(`${player.user?.username ?? player.bot.name} ${$t('play.game.declared-war-on-you')}`, 'warning');
                return;
            }

            showToast(`${player.user?.username ?? player.bot.name} ${$t('play.game.declared-war')} ${targetPlayer.user?.username ?? targetPlayer.bot.name}`);
        });

        askPeaceNotification.onMessage(async ({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): Promise<void> => {
            await updatePlayersInGame([player, targetPlayer]);

            if (targetPlayer.id === currentPlayer.id) {
                showToast(`${player.user?.username ?? player.bot.name} ${$t('play.game.peace.asked')}`);
            }
        });

        refusePeaceNotification.onMessage(async ({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): Promise<void> => {
            await updatePlayersInGame([player, targetPlayer]);

            if (targetPlayer.id === currentPlayer.id) {
                showToast(`${player.user?.username ?? player.bot.name} ${$t('play.game.peace.refused')}`, 'warning');
            }
        });

        cancelPendingPeaceNotification.onMessage(async ({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): Promise<void> => {
            await updatePlayersInGame([player, targetPlayer]);

            if (targetPlayer.id === currentPlayer.id) {
                showToast(`${player.user?.username ?? player.bot.name} ${$t('play.game.peace.cancelled')}`);
            }
        });

        peaceNotification.onMessage(async ({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): Promise<void> => {
            await updatePlayersInGame([player, targetPlayer]);

            const isCurrent = currentPlayer.id === player.id || currentPlayer.id === targetPlayer.id;

            if (isCurrent === false) {
                showToast(`${player.user?.username ?? player.bot.name} ${$t('play.game.peace.made')} ${targetPlayer.user?.username ?? targetPlayer.bot.name}`, 'warning');
            }
        });

        financedNotification.onMessage(async ({ player, targetPlayer, amount }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer; amount: number }): Promise<void> => {
            await updatePlayersInGame([player, targetPlayer]);

            showToast(`${formatGameNumbers(amount)} ${$t('play.game.received-from')} ${targetPlayer.user?.username ?? targetPlayer.bot.name}`);
        });

        nextTurnNotification.onMessage((): void => {
            // TODO: send all turn actions : moves, attacks
        });
    };

    const cleanupTransmits = async (): Promise<void> => {
        try {
            await Promise.all([
                gameUpdateNotification?.delete().then(() => console.log('gameUpdateNotification deleted')),
                playerUpdateNotification?.delete().then(() => console.log('playerUpdateNotification deleted')),
                territoryUpdateNotification?.delete().then(() => console.log('territoryUpdateNotification deleted')),
                warNotification?.delete().then(() => console.log('warNotification deleted')),
                askPeaceNotification?.delete().then(() => console.log('askPeaceNotification deleted')),
                refusePeaceNotification?.delete().then(() => console.log('refusePeaceNotification deleted')),
                cancelPendingPeaceNotification?.delete().then(() => console.log('cancelPendingPeaceNotification deleted')),
                peaceNotification?.delete().then(() => console.log('peaceNotification deleted')),
                financedNotification?.delete().then(() => console.log('financedNotification deleted')),
                nextTurnNotification?.delete().then(() => console.log('nextTurnNotification deleted')),
            ]);
        } catch (error: any) {
            console.error('Error during cleanup:', error);
        }
    };

    $: {
        if (game.id !== undefined) {
            setup();
        }
    }

    onDestroy(() => {
        cleanupTransmits();
    });
</script>
