<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import { showToast } from '../../services/toastService';
	import axios from 'axios';
	import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import Icon from "../shared/Icon.svelte";
    import {onMount, tick} from "svelte";

	export let game: SerializedGame;
	export let selectedTerritory: SerializedGameTerritory;
	export let currentPlayer: SerializedRoomPlayer;

	let isButtonDisabled: boolean = false;
    let isLoading: boolean = false;
    let buttonElement: HTMLButtonElement;

    onMount(async (): Promise<void> => {
        await tick();
        const { width, height } = buttonElement.getBoundingClientRect();
        buttonElement.style.setProperty('width', `${width}px`);
        buttonElement.style.setProperty('height', `${height}px`);
    });

	const handleSubvert = async (): Promise<void> => {
        isLoading = true;
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
			}
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
        isLoading = false;
	};

	$: isButtonDisabled = (currentPlayer?.gold ?? 0) < game.map.subvertCost;
</script>

<button bind:this={buttonElement} disabled={isButtonDisabled} class="flex justify-center items-center bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 rounded-xl" on:click={handleSubvert}>
    {#if isLoading}
        <Icon name="spinner" />
    {:else}
        {$t('play.game.subvert')}
    {/if}
</button>
