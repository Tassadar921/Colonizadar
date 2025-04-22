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
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';

	const dispatch = createEventDispatcher();

	export let game: SerializedGame;

	let isInitialized = false;

	let gameUpdateNotification: Subscription;
	let playerUpdateNotification: Subscription;
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

		nextTurnNotification.onMessage((): void => {
			// TODO: send our turn actions
		});
	};

	const cleanupTransmits = async (): Promise<void> => {
		try {
			await Promise.all([
				gameUpdateNotification?.delete().then(() => console.log('gameUpdateNotification deleted')),
				playerUpdateNotification?.delete().then(() => console.log('playerUpdateNotification deleted')),
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
