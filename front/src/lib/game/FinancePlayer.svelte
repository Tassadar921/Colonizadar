<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import axios from 'axios';
	import { showToast } from '../../services/toastService';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import Modal from "../shared/Modal.svelte";
    import Subtitle from "../shared/Subtitle.svelte";

	export let game: SerializedGame;
	export let player: SerializedRoomPlayer;

    let showModal: boolean = false;

	const handleFinancePlayer = async (amount: number): Promise<void> => {
		try {
			const { data } = await axios.patch(`/api/game/${game.id}/actions/player/${player.id}/finance`, { amount });
			game = {
				...game,
				players: game.players.map((player: SerializedRoomPlayer) => {
					if (data.id === player.id) {
						return data.player;
					}
					return player;
				}),
			};
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
	};
</script>

<button class="bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 rounded-xl" on:click={() => (showModal = true)}>
    {$t('play.game.finance')}
</button>

<Modal bind:showModal>
    <Subtitle slot="header">{$t('play.game.finance-player-modal.title')}</Subtitle>
</Modal>
