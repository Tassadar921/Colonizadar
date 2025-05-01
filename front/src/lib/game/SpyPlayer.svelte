<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import axios from 'axios';
	import { showToast } from '../../services/toastService';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import Popover from '../shared/Popover.svelte';
	import { formatGameNumbers } from '../../services/stringService';

	export let game: SerializedGame;
	export let player: SerializedRoomPlayer;

	let buttonElement: HTMLButtonElement;
	let isButtonDisabled: boolean = false;
	let showPopover: boolean = false;

	const handleSpyPlayer = async (): Promise<void> => {
		try {
			const { data } = await axios.get(`/api/game/${game.id}/actions/player/${player.id}/spy`);
			game = {
				...game,
				players: game.players.map((pl: SerializedRoomPlayer) => {
					if (data.player.id === pl.id) {
						return data.player;
					} else if (data.targetPlayer.id === pl.id) {
						return data.targetPlayer;
					}
					return pl;
				}),
			};
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
	};

	$: isButtonDisabled = !!player.gold;
</script>

<button
	bind:this={buttonElement}
	class="{isButtonDisabled ? 'cursor-disabled' : 'hover:bg-green-600'} bg-green-500 transition-colors duration-300 px-3 rounded-xl"
	on:click={handleSpyPlayer}
	on:mouseenter={() => (showPopover = true)}
	on:focus={() => (showPopover = true)}
	on:mouseleave={() => (showPopover = false)}
	on:blur={() => (showPopover = false)}
	disabled={isButtonDisabled}
>
	{$t('play.game.spy')}
</button>

<Popover target={buttonElement} show={showPopover}>
	<span>{$t('play.game.cost')} : {formatGameNumbers(game?.map?.spyPlayerCost ?? 0)}</span>
</Popover>
