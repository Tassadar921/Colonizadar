<script lang="ts">
	import Button from '../shared/Button.svelte';
	import Icon from '../shared/Icon.svelte';
	import axios from 'axios';
	import { showToast } from '../../services/toastService';
	import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import Close from '../icons/Close.svelte';

	export let room: SerializedRoom;
	export let player: SerializedRoomPlayer;

	const handleKick = async (player: SerializedRoomPlayer) => {
		try {
			const response = await axios.delete(`/api/room/${room.id}/player/kick/${player.id}`);
			showToast(`${response.data.message}`);
			room.players = room.players.filter((p) => p.id !== player.id);
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
	};
</script>

<Button
	ariaLabel="Kick user from room"
	customStyle
	className="flex items-center transition-all duration-300 hover:scale-110 mt-2 transform text-red-600 hover:text-red-400"
	on:click={() => handleKick(player)}
>
	<Close size={40} />
</Button>
