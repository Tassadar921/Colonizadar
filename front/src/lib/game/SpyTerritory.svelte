<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
	import axios from 'axios';
	import { showToast } from '../../services/toastService';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';

	export let game: SerializedGame;
	export let selectedTerritory: SerializedGameTerritory;
	export let currentPlayer: SerializedRoomPlayer;

	let isButtonDisabled: boolean = false;

	const handleSpyTerritory = async (): Promise<void> => {
		try {
			const { data } = await axios.get(`/api/game/${game.id}/actions/territory/${selectedTerritory.territory.code}/spy`);
			game = {
				...game,
				territories: game.territories.map((gt: SerializedGameTerritory) => {
					if (gt.territory.code === selectedTerritory.territory.code) {
						console.log(selectedTerritory, data.territory);
						selectedTerritory = data.territory;
						return data.territory;
					}
					return gt;
				}),
				players: game.players.map((player: SerializedGameTerritory) => {
					if (data.player.id === player.id) {
						return data.player;
					}
					return player;
				}),
			};
			showToast(data.message);
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
	};

	$: isButtonDisabled = (currentPlayer?.gold ?? 0) < game.map.spyCost || !!selectedTerritory.infantry;
</script>

<button class="{isButtonDisabled ? 'cursor-disabled' : 'hover:bg-green-600'} bg-green-500 transition-colors duration-300 px-3 rounded-xl" on:click={handleSpyTerritory} disabled={isButtonDisabled}>
	{$t('play.game.spy')}
</button>
