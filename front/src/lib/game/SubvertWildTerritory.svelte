<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import { showToast } from '../../services/toastService';
	import axios from 'axios';
	import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let game: SerializedGame;
	export let selectedTerritory: SerializedGameTerritory;
	export let currentPlayer: SerializedRoomPlayer;

	let isButtonDisabled: boolean = false;

	const handleSubvert = async (): Promise<void> => {
		try {
			const { data } = await axios.patch(`/api/game/${game.id}/actions/territory/${selectedTerritory.territory.code}/subvert`);
			game = {
				...game,
				players: game.players.map((player: SerializedRoomPlayer) => {
					if (data.player.id === player.id) {
						return data.player;
					}
					return player;
				}),
			};
			selectedTerritory.infantry = undefined;
			if (data.message) {
				showToast(data.message);
				dispatch('conquest');
			}
		} catch (error: any) {
			console.log(error.response.data);
			showToast(error.response.data.error, 'error');
		}
	};

	$: isButtonDisabled = (currentPlayer?.gold ?? 0) < game.map.subvertCost;
</script>

<button disabled={isButtonDisabled} class="bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 rounded-xl" on:click={handleSubvert}>
	{$t('play.game.subvert')}
</button>
