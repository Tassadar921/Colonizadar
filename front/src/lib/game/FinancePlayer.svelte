<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import axios from 'axios';
	import { showToast } from '../../services/toastService';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import Modal from '../shared/Modal.svelte';
	import Subtitle from '../shared/Subtitle.svelte';
	import Range from '../shared/Range.svelte';
	import Form from '../shared/Form.svelte';

	export let game: SerializedGame;
	export let currentPlayer: SerializedRoomPlayer;
	export let targetPlayer: SerializedRoomPlayer;

	let amount: number;
	let showModal: boolean = false;

	const handleSuccess = async (event: CustomEvent): Promise<void> => {
		game = {
			...game,
			players: game.players.map((player: SerializedRoomPlayer) => {
				if (event.detail.player.id === player.id) {
					return event.detail.player;
				}
				return player;
			}),
		};
		showToast(event.detail.message);
	};

	const handleError = async (event: CustomEvent): Promise<void> => {
		console.log(event);
	};
</script>

<button class="bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 rounded-xl" on:click={() => (showModal = true)}>
	{$t('play.game.finance')}
</button>

<Modal bind:showModal>
	<Subtitle slot="header">{$t('play.game.finance-player-modal.title')}</Subtitle>
	<Form method="PATCH" action={`/api/game/${game.id}/actions/player/${targetPlayer.id}/finance`} hasBackground={false} isValid={true} on:success={handleSuccess} on:error={handleError}>
		<Range name="amount" bind:value={amount} min={game.map.financePlayerStep} max={currentPlayer?.gold ?? 0} step={game.map.financePlayerStep} />
	</Form>
</Modal>
