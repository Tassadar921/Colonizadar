<script lang="ts">
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import Bot from '../icons/Bot.svelte';
	import Crown from '../icons/Crown.svelte';
	import { profile } from '../../stores/profileStore';
	import { t } from 'svelte-i18n';
	import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
	import SpyPlayer from './SpyPlayer.svelte';
	import FinancePlayer from './FinancePlayer.svelte';
	import { formatGameNumbers, formatSeasonFromNumber } from '../../services/stringService';
	import AcceptPeace from './AcceptPeace.svelte';
	import RefusePeace from './RefusePeace.svelte';
	import CancelPendingPeace from './CancelPendingPeace.svelte';
	import DeclareWar from './DeclareWar.svelte';
	import AskPeace from './AskPeace.svelte';
	import type SerializedWar from 'colonizadar-backend/app/types/serialized/serialized_war';
	import type SerializedPeace from 'colonizadar-backend/app/types/serialized/serialized_peace';

	export let game: SerializedGame;
	export let currentPlayer: SerializedRoomPlayer;
	export let player: SerializedRoomPlayer;

	let currentPeace: SerializedPeace | undefined;

	$: currentPeace = currentPlayer.peaces?.find(({ enemy }: { enemy: SerializedRoomPlayer }) => enemy.id === player.id);
</script>

<div class="ml-3 flex gap-5">
	<!--    Player country    -->
	<div class="flex justify-center items-center">
		<img alt={player.country.name} src={`${import.meta.env.VITE_API_BASE_URL}/api/static/country-flag/${player.country.id}?token=${localStorage.getItem('apiToken')}`} class="max-h-10" />
	</div>

	<!--    Player name & profile picture    -->
	<div class="flex flex-col gap-3 flex-wrap items-center">
		{#if player.user}
			{#if player.user.profilePicture}
				<img
					alt={player.user.username}
					src={`${import.meta.env.VITE_API_BASE_URL}/api/static/profile-picture/${player.user.id}?token=${localStorage.getItem('apiToken')}`}
					class="size-10 rounded-full"
				/>
			{:else}
				<img alt={player.user.username} src={import.meta.env.VITE_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
			{/if}
			<p class="flex gap-1 {player.user.id === $profile?.id ? 'font-bold' : ''}">
				{#if game.owner.id === player.user.id}
					<span class="text-orange-500">
						<Crown />
					</span>
				{/if}
				{player.user.username}
			</p>
		{:else if player.bot}
			<img alt={player.bot.name} src={`${import.meta.env.VITE_API_BASE_URL}/api/static/bot-picture/${player.bot.id}?token=${localStorage.getItem('apiToken')}`} class="w-10 rounded-full" />
			<div class="flex flex-col">
				<p class="flex gap-1">
					<span class="text-green-500">
						<Bot />
					</span>
					{player.bot.name}
				</p>
				<p>({player.difficulty.name})</p>
			</div>
		{/if}
		<p>{$t('play.game.score')}: {formatGameNumbers(player.score)}</p>
		<p>{$t('play.game.gold')}: {player.gold ? formatGameNumbers(player.gold) : '?'}</p>
		<p>{$t('play.game.territories')}: {formatGameNumbers(game.territories.reduce((accumulator, territory: SerializedGameTerritory) => accumulator + Number(territory.owner?.id === player.id), 0))}</p>
		{#if player.user?.id !== $profile?.id}
			<div class="flex flex-col gap-3">
				<div class="flex gap-3">
					<SpyPlayer bind:game {player} />
					<FinancePlayer bind:game {currentPlayer} targetPlayer={player} />
				</div>
				<div class="flex gap-3">
					{#if currentPlayer.wars?.find((war: SerializedWar) => war.enemy.id === player.id)}
						{#if currentPlayer.receivedPendingPeaces?.find((enemy: SerializedRoomPlayer) => enemy.id === player.id)}
							<p>{currentPlayer.receivedPendingPeaces?.length}</p>
							<AcceptPeace bind:game targetPlayer={player} />
							<RefusePeace bind:game targetPlayer={player} />
						{:else if currentPlayer.sentPendingPeaces?.find((enemy: SerializedRoomPlayer) => enemy.id === player.id)}
							<CancelPendingPeace bind:game targetPlayer={player} />
						{:else}
							<AskPeace bind:game targetPlayer={player} />
						{/if}
					{:else if !currentPeace}
						<DeclareWar bind:game targetPlayer={player} />
					{:else}
						<p>{$t('play.game.peace.expires-on')} {$t(`play.game.${formatSeasonFromNumber(currentPeace.expirationSeason)}`)} {currentPeace.expirationYear}</p>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
