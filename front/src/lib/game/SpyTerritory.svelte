<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
	import axios from 'axios';
	import { showToast } from '../../services/toastService';

	export let game: SerializedGame;
	export let selectedTerritory: SerializedGameTerritory;

	let isButtonDisabled: boolean = false;

	const handleSpyTerritory = async (): Promise<void> => {
		try {
			const response = await axios.get(`/api/game/${game.id}/actions/${selectedTerritory.territory.code}/spy`);
			game = {
				...game,
				territories: game.territories.map((gt: SerializedGameTerritory) => {
					if (gt.territory.code === selectedTerritory.territory.code) {
						selectedTerritory = response.data;
						return response.data;
					}
					return gt;
				}),
			};
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
	};

	$: isButtonDisabled = !!selectedTerritory.infantry;
</script>

<button class="{isButtonDisabled ? 'cursor-disabled' : 'hover:bg-green-600'} bg-green-500 transition-colors duration-300 px-3 rounded-xl" on:click={handleSpyTerritory} disabled={isButtonDisabled}>
	{$t('play.game.spy')}
</button>
