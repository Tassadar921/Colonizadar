<script lang="ts">
	import { t } from 'svelte-i18n';
	import Modal from '../shared/Modal.svelte';
	import Subtitle from '../shared/Subtitle.svelte';
	import Form from '../shared/Form.svelte';
	import Incrementation from '../shared/Incrementation.svelte';
	import { showToast } from '../../services/toastService';
	import { formatGameNumbers } from '../../services/stringService';

	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';

	export let game: SerializedGame;
	export let gameTerritory: SerializedGameTerritory;
	export let currentPlayer: SerializedRoomPlayer;

	let amount: number = 1000;
	let cost: number = 0;
	let showModal: boolean = false;
	let isValid: boolean = true;

	let canDecrement: boolean = true;
	let canIncrement: boolean = true;

	const getInfantryFromCost = (cost: number): number => {
		const rawAmount = Math.floor((cost * 1000) / (game.map.baseInfantryCost * currentPlayer.country.infantryPriceFactor));
		return Math.floor(rawAmount / 1000) * 1000;
	};

	const handleSuccess = async (event: CustomEvent): Promise<void> => {
		game = {
			...game,
			players: game.players.map((player: SerializedRoomPlayer) => {
				if (event.detail.player.id === player.id) {
					return event.detail.player;
				}
				return player;
			}),
			territories: game.territories.map((territory: SerializedGameTerritory) => {
				if (event.detail.territory.id === territory.id) {
					return event.detail.territory;
				}
				return territory;
			}),
		};
		amount = 1000;
		showToast(event.detail.message);
	};

	$: {
		cost = Math.ceil((game.map.baseInfantryCost * currentPlayer.country.infantryPriceFactor * amount) / 1000) * 1000;
		const maxAffordableAmount = getInfantryFromCost(currentPlayer.gold ?? 0);
        console.log(amount, maxAffordableAmount);

		if (amount > maxAffordableAmount) {
			amount = maxAffordableAmount;
			canIncrement = false;
		} else {
			canIncrement = amount + 1000 <= maxAffordableAmount;
		}

		isValid = amount >= 1000 && amount % 1000 === 0;
		canDecrement = amount > 1000;
	}
</script>

<button class="bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 py-1 rounded-xl text-white" on:click={() => (showModal = true)}>
	{$t('play.game.buy-infantry')}
</button>

<Modal bind:showModal>
	<Subtitle slot="header">
		{$t('play.game.buy-infantry-modal.title')}
		{gameTerritory.territory.name}
	</Subtitle>

	<Form method="PATCH" action={`/api/game/${game.id}/actions/territory/${gameTerritory.id}/buy/infantry`} hasBackground={false} {isValid} on:success={handleSuccess}>
		<Incrementation bind:value={amount} smallStep={1000} largeStep={100000} smallShiftStep={10000} largeShiftStep={1000000} {canDecrement} {canIncrement} />

		<p class="text-center mt-4">
			{$t('play.game.will-cost')}
			<span class="text-primary-500 font-bold">
				{formatGameNumbers(cost)}
			</span>
		</p>
	</Form>
</Modal>
