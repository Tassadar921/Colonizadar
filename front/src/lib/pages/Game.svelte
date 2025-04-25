<script lang="ts">
	import Map from '../game/Map.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { showToast } from '../../services/toastService';
	import { navigate } from '../../stores/locationStore';
	import Title from '../shared/Title.svelte';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import SideGamePlayer from '../game/SideGamePlayer.svelte';
	import { t } from 'svelte-i18n';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import { profile } from '../../stores/profileStore';

	export let gameId: string;

	let game: SerializedGame;
	let myPlayer: SerializedRoomPlayer;

	onMount(async (): Promise<void> => {
		try {
			const { data: gameData } = await axios.get(`/api/game/${gameId}`);
			game = gameData.game;
			myPlayer = game.players.find((player: SerializedRoomPlayer) => player.user?.id === $profile!.id);
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
			navigate('/play');
		}
	});

	const formatSeasonFromNumber = (seasonNumber: number): string => {
		switch (seasonNumber) {
			case 1:
				return 'spring';
			case 2:
				return 'summer';
			case 3:
				return 'fall';
			case 4:
				return 'winter';
			default:
				return 'spring';
		}
	};
</script>

<Title title={game?.name} />

{#if game}
	<p>{$t('play.game.gold')}: {formatSeasonFromNumber((myPlayer?.gold ? myPlayer.gold : 0) * 1000)}</p>
	<p>{$t('play.game.year')}: {game.year}</p>
	<p>{$t('play.game.season')}: {$t(`play.game.${formatSeasonFromNumber(game.season)}`)}</p>
{/if}

<!-- TODO: faire en sorte que ça soit présentable pour 2, 4, 6 (idéalement 8 ou même 10 mais pas sûr d'avoir la place) -->
<!-- Ne pas inclure dans le if game, pour charger le svg en parallèle de la requête au back pour récupérer la data -->
<div class="flex gap-5 justify-center items-center">
	<div class="flex flex-col">
		{#each game?.players.slice(0, game?.players.length / 2) as player}
			<SideGamePlayer {game} {player} />
		{/each}
	</div>
	<div class="w-4/5 flex flex-col gap-3 items-center">
		<Map bind:game />
	</div>
	<div class="flex flex-col">
		{#each game?.players.slice(game?.players.length / 2) as player}
			<SideGamePlayer {game} {player} />
		{/each}
	</div>
</div>
