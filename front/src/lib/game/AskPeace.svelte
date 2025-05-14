<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import { showToast } from '../../services/toastService';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import axios from 'axios';

	export let game: SerializedGame;
	export let targetPlayer: SerializedRoomPlayer;

	const handleAskPeace = async (): Promise<void> => {
		try {
			const { data } = await axios.put(`/api/game/${game.id}/actions/player/${targetPlayer.id}/peace/ask`);
			showToast(data.message);
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
	};
</script>

<button class="bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 rounded-xl" on:click={handleAskPeace}>
	{$t('play.game.peace.ask')}
</button>
