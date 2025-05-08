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

	let amount: number = 5;
	let cost: number = 0;
	let showModal: boolean = false;
	let isValid: boolean = true;

	let canDecrement: boolean = true;
	let canIncrement: boolean = true;

	const getShipsFromCost = (cost: number): number => {
		const rawAmount = Math.floor((cost * 5) / (game.map.baseShipCost * currentPlayer.country.shipPriceFactor));
		return Math.floor(rawAmount / (5 * 1000)) * 5;
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
					gameTerritory = event.detail.territory;
					return event.detail.territory;
				}
				return territory;
			}),
		};
		amount = 5;
		showToast(event.detail.message);
	};

	$: {
		const maxAffordableAmount = getShipsFromCost(currentPlayer.gold ?? 0);

		if (amount > maxAffordableAmount) {
			amount = maxAffordableAmount;
			canIncrement = false;
		} else {
			canIncrement = amount + 5 <= maxAffordableAmount;
		}

		console.log(Math.ceil((game.map.baseShipCost * currentPlayer.country.shipPriceFactor * amount) / 5) * 5);
		console.log(game.map.baseShipCost, currentPlayer.country.shipPriceFactor);
		cost = Math.ceil((game.map.baseShipCost * currentPlayer.country.shipPriceFactor * amount) / 5) * 5;
		isValid = amount >= 5 && amount % 5 === 0;
		canDecrement = amount > 5;
	}

	$: console.log(cost);
</script>

<button class="bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 py-1 rounded-xl text-white" on:click={() => (showModal = true)}>
	{$t('play.game.buy-ships')}
</button>

<Modal bind:showModal>
	<Subtitle slot="header">
		{$t('play.game.buy-ships-modal.title')}
		{gameTerritory.territory.name}
	</Subtitle>

	<div class="flex flex-col gap-3">
		<p>{$t('play.game.total-infantry')}: {gameTerritory.infantry}</p>
		<p>{$t('play.game.total-ships')}: {gameTerritory.ships}</p>
	</div>
	<Form method="PATCH" action={`/api/game/${game.id}/actions/territory/${gameTerritory.territory.code}/buy/ships`} hasBackground={false} {isValid} on:success={handleSuccess}>
		<Incrementation bind:value={amount} smallStep={5} smallShiftStep={10} largeStep={100} largeShiftStep={1000} {canDecrement} {canIncrement} name="amount" />

		<p class="text-center mt-4">
			{$t('play.game.will-cost')}
			<span class="text-primary-500 font-bold">
				{formatGameNumbers(cost)}
			</span>
		</p>
	</Form>
</Modal>
