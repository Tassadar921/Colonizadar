<script lang="ts">
	import { transmit } from '../../stores/transmitStore';
	import { onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Subscription } from '@adonisjs/transmit-client';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import { showToast } from '../../services/toastService';
	import t from 'svelte-i18n';

	const dispatch = createEventDispatcher();

	export let game: SerializedGame;
	export let currentPlayer: SerializedRoomPlayer;

	let isInitialized = false;

	let gameUpdateNotification: Subscription;
	let playerUpdateNotification: Subscription;
	let warNotification: Subscription;
	let askPeaceNotification: Subscription;
	let peaceNotification: Subscription;
	let financedNotification: Subscription;
	let nextTurnNotification: Subscription;

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
		gameUpdateNotification = $transmit.subscription(`notification/play/game/${game.id}/update`);
		playerUpdateNotification = $transmit.subscription(`notification/play/game/${game.id}/player/update`);
		warNotification = $transmit.subscription(`notification/play/game/${game.id}/war`);
		askPeaceNotification = $transmit.subscription(`notification/play/game/${game.id}/${currentPlayer.id}/ask-peace`);
		peaceNotification = $transmit.subscription(`notification/play/game/${game.id}/peace`);
		financedNotification = $transmit.subscription(`notification/play/game/${game.id}/${currentPlayer.id}/financed`);
		nextTurnNotification = $transmit.subscription(`notification/play/game/${game.id}/next-turn`);

		await Promise.all([gameUpdateNotification.create(), playerUpdateNotification.create(), nextTurnNotification.create()]);
	};

	const setupHandlers = (): void => {
		gameUpdateNotification.onMessage(({ game: newGame }: { game: SerializedGame }): void => {
			game = newGame;
		});

		playerUpdateNotification.onMessage(({ player }: { player: SerializedRoomPlayer }): void => {
			game.players = game.players.map((p: SerializedRoomPlayer) => (p.id === player.id ? { ...p, ...player } : p));
		});

		warNotification.onMessage(({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): void => {
			game.players = game.players.map((p: SerializedRoomPlayer) => {
				if (p.id === player.id) {
					return player;
				}
				if (p.id === targetPlayer.id) {
					return targetPlayer;
				}
				return p;
			});
			if (currentPlayer.id === player.id) {
				showToast(`${t('play.game.you-declared-war')} ${targetPlayer.user?.username || targetPlayer.bot.name}`);
			} else if (currentPlayer.id === targetPlayer.id) {
				showToast(`${player.user?.username || player.bot.name} ${t('play.game.declared-war-on-you')}`, 'warning');
			} else {
				showToast(`${player.user?.username || player.bot.name} ${t('play.game.declared-war')} ${targetPlayer.user?.username || targetPlayer.bot.name}`);
			}
		});

		askPeaceNotification.onMessage(({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): void => {
			game.players = game.players.map((p: SerializedRoomPlayer) => {
				if (p.id === player.id) {
					return player;
				}
				if (p.id === targetPlayer.id) {
					return targetPlayer;
				}
				return p;
			});
		});

		peaceNotification.onMessage(({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): void => {
			game.players = game.players.map((p: SerializedRoomPlayer) => {
				if (p.id === player.id) {
					return player;
				}
				if (p.id === targetPlayer.id) {
					return targetPlayer;
				}
				return p;
			});
			if (currentPlayer.id === player.id || currentPlayer.id === targetPlayer.id) {
				const otherPlayer = currentPlayer.id === player.id ? targetPlayer : player;
				showToast(`${t('play.game.you-made-peace-with')} ${otherPlayer.user?.username || otherPlayer.bot.name}`);
			} else {
				showToast(`${player.user?.username || player.bot.name} ${t('play.game.made-peace')} ${targetPlayer.user?.username || targetPlayer.bot.name}`, 'warning');
			}
		});

		financedNotification.onMessage(({ player, targetPlayer, amount }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer; amount: number }): void => {
			game.players = game.players.map((p: SerializedRoomPlayer) => {
				if (p.id === player.id) {
					return player;
				} else if (p.id === targetPlayer.id) {
					showToast(`${amount} ${t('play.game.received-from')} ${targetPlayer.user?.username || targetPlayer.bot.name}`);
					return targetPlayer;
				}
				return p;
			});
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
				warNotification?.delete().then(() => console.log('warNotification deleted')),
				askPeaceNotification?.delete().then(() => console.log('askPeaceNotification deleted')),
				peaceNotification?.delete().then(() => console.log('peaceNotification deleted')),
				financedNotification?.delete().then(() => console.log('financedNotification deleted')),
				nextTurnNotification?.delete().then(() => console.log('nextTurnNotification deleted')),
			]);
		} catch (error: any) {
			console.error('Error during cleanup:', error);
		}
	};

	$: if (game.id) {
		setup();
	}

	onDestroy(() => {
		cleanupTransmits();
	});
</script>
