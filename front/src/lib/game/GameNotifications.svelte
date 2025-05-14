<script lang="ts">
	import { transmit } from '../../stores/transmitStore';
	import { onDestroy } from 'svelte';
	import type { Subscription } from '@adonisjs/transmit-client';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import { showToast } from '../../services/toastService';
	import { t } from 'svelte-i18n';
	import { formatGameNumbers } from '../../services/stringService';
	import axios from 'axios';

	export let game: SerializedGame;
	export let currentPlayer: SerializedRoomPlayer;

	let isInitialized = false;

	let gameUpdateNotification: Subscription;
	let playerUpdateNotification: Subscription;
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
		const shouldRefreshCurrent = playersToUpdate.some((p) => p.id === currentPlayer.id);

		const updatedPlayers = await Promise.all(
			game.players.map(async (p) => {
				const updated = playersToUpdate.find((u) => u.id === p.id);

				if (updated === undefined) {
					return p;
				}

				if (p.id === currentPlayer.id && shouldRefreshCurrent) {
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

		spiedNotification.onMessage(({ player }: { player: SerializedRoomPlayer }): void => {
			const name = player.user?.username ?? player.bot.name;
			showToast(`${$t('play.game.spied-by')} ${name}`, 'warning');
		});

		warNotification.onMessage(async ({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): Promise<void> => {
			await updatePlayersInGame([player, targetPlayer]);

			if (currentPlayer.id === player.id) {
				return;
			}

			if (currentPlayer.id === targetPlayer.id) {
				const name = player.user?.username ?? player.bot.name;
				showToast(`${name} ${$t('play.game.declared-war-on-you')}`, 'warning');
				return;
			}

			const name1 = player.user?.username ?? player.bot.name;
			const name2 = targetPlayer.user?.username ?? targetPlayer.bot.name;
			showToast(`${name1} ${$t('play.game.declared-war')} ${name2}`);
		});

		askPeaceNotification.onMessage(async ({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): Promise<void> => {
			await updatePlayersInGame([player, targetPlayer]);

			if (targetPlayer.id === currentPlayer.id) {
				const name = player.user?.username ?? player.bot.name;
				showToast(`${name} ${$t('play.game.peace.asked')}`);
			}
		});

		refusePeaceNotification.onMessage(async ({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): Promise<void> => {
			await updatePlayersInGame([player, targetPlayer]);

			if (targetPlayer.id === currentPlayer.id) {
				const name = player.user?.username ?? player.bot.name;
				showToast(`${name} ${$t('play.game.peace.refused')}`, 'warning');
			}
		});

		cancelPendingPeaceNotification.onMessage(async ({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): Promise<void> => {
			await updatePlayersInGame([player, targetPlayer]);

			if (targetPlayer.id === currentPlayer.id) {
				const name = player.user?.username ?? player.bot.name;
				showToast(`${name} ${$t('play.game.peace.cancelled')}`);
			}
		});

		peaceNotification.onMessage(async ({ player, targetPlayer }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer }): Promise<void> => {
			await updatePlayersInGame([player, targetPlayer]);

			const isCurrent = currentPlayer.id === player.id || currentPlayer.id === targetPlayer.id;

			if (isCurrent === false) {
				const name1 = player.user?.username ?? player.bot.name;
				const name2 = targetPlayer.user?.username ?? targetPlayer.bot.name;
				showToast(`${name1} ${$t('play.game.peace.made')} ${name2}`, 'warning');
			}
		});

		financedNotification.onMessage(async ({ player, targetPlayer, amount }: { player: SerializedRoomPlayer; targetPlayer: SerializedRoomPlayer; amount: number }): Promise<void> => {
			await updatePlayersInGame([player, targetPlayer]);

			const name = targetPlayer.user?.username ?? targetPlayer.bot.name;
			showToast(`${formatGameNumbers(amount)} ${$t('play.game.received-from')} ${name}`);
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
