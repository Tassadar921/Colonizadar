<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import { showToast } from '../../services/toastService';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
	import axios from 'axios';
	import { formatGameNumbers } from '../../services/stringService';

	export let game: SerializedGame;
	export let gameTerritory: SerializedGameTerritory;

	const handleFortify = async (): Promise<void> => {
		try {
			const { data } = await axios.patch(`/api/game/${game.id}/actions/territory/${gameTerritory.territory.code}/fortify`);
			game = {
				...game,
				players: game.players.map((player: SerializedRoomPlayer) => {
					if (data.player.id === player.id) {
						return data.player;
					}
					return player;
				}),
				territories: game.territories.map((gameTerritory: SerializedGameTerritory) => {
					if (data.territory.id === gameTerritory.id) {
						return data.territory;
					}
					return gameTerritory;
				}),
			};
			showToast(data.message);
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
	};
</script>

<button class="bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 rounded-xl" on:click={handleFortify}>
	{$t('play.game.fortify')}
</button>

<span>{$t('play.game.cost')} : {formatGameNumbers(game?.map.fortifyCost ?? 0)}</span>
