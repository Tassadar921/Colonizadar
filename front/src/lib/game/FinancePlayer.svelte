<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import { showToast } from '../../services/toastService';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import Modal from '../shared/Modal.svelte';
	import Subtitle from '../shared/Subtitle.svelte';
	import Range from '../shared/Range.svelte';
	import Form from '../shared/Form.svelte';
	import { formatGameNumbers } from '../../services/stringService';

	export let game: SerializedGame;
	export let currentPlayer: SerializedRoomPlayer;
	export let targetPlayer: SerializedRoomPlayer;

	let amount: number;
	let showModal: boolean = false;
	let isValid: boolean = false;

	const handleSuccess = async (event: CustomEvent): Promise<void> => {
		game = {
			...game,
			players: game.players.map((player: SerializedRoomPlayer) => {
				if (event.detail.player.id === player.id) {
					amount = game.map.financePlayerStep;
					return event.detail.player;
				}
				return player;
			}),
		};
		showToast(event.detail.message);
	};

	$: isValid = amount >= game.map.financePlayerStep && amount % game.map.financePlayerStep === 0 && amount <= (currentPlayer?.gold ?? 0);
</script>

<button class="bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 rounded-xl" on:click={() => (showModal = true)}>
	{$t('play.game.finance')}
</button>

<Modal bind:showModal>
	<Subtitle slot="header">{$t('play.game.finance-player-modal.title')}</Subtitle>
	<Form method="PATCH" action={`/api/game/${game.id}/actions/player/${targetPlayer.id}/finance`} hasBackground={false} {isValid} on:success={handleSuccess}>
		<Range name="amount" bind:value={amount} min={game.map.financePlayerStep} max={currentPlayer?.gold ?? 0} step={game.map.financePlayerStep} />
		<p>
			<span class="text-primary-500">
				{targetPlayer.user?.username || targetPlayer.bot?.name}
			</span>
			{$t('play.game.will-receive')}
			<span class="text-primary-500">
				{formatGameNumbers(Math.floor((amount * game.map.financePlayerCostFactor) / 1000) * 1000)}
			</span>
		</p>
	</Form>
</Modal>
