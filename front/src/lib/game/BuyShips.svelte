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
    import ActionButton from '../shared/ActionButton.svelte';

    export let game: SerializedGame;
    export let selectedTerritory: SerializedGameTerritory;
    export let currentPlayer: SerializedRoomPlayer;

    let isButtonDisabled: boolean = false;
    let amount: number = 5;
    let cost: number = 0;
    let showModal: boolean = false;
    let canSubmit: boolean = true;

    let canDecrement: boolean = true;
    let canIncrement: boolean = true;

    const getShipsFromCost = (cost: number): number => {
        const rawAmount = cost / (game.map.baseShipCost * currentPlayer.country.shipPriceFactor);

        return Math.floor(rawAmount / 5) * 5;
    };

    const handleSuccess = async (event: CustomEvent): Promise<void> => {
        game = {
            ...game,
            players: game.players.map((player: SerializedRoomPlayer) => {
                if (event.detail.player.id === player.id) {
                    amount = 5;
                    return event.detail.player;
                }
                return player;
            }),
            territories: game.territories.map((territory: SerializedGameTerritory) => {
                if (event.detail.territory.id === territory.id) {
                    selectedTerritory = event.detail.territory;
                    return event.detail.territory;
                }
                return territory;
            }),
        };
        amount = 5;
        showToast(event.detail.message);
    };

    $: isButtonDisabled = (currentPlayer.gold ?? 0) < game.map.baseShipCost * currentPlayer.country.shipPriceFactor * 5;
    $: {
        const maxAffordableAmount = getShipsFromCost(currentPlayer.gold ?? 0);

        if (amount > maxAffordableAmount) {
            amount = maxAffordableAmount;
            canIncrement = false;
        } else {
            canIncrement = amount + 5 <= maxAffordableAmount;
        }

        cost = game.map.baseShipCost * currentPlayer.country.shipPriceFactor * amount;
        canSubmit = amount >= 5 && amount % 5 === 0;
        canDecrement = amount > 5;
    }
</script>

<ActionButton {isButtonDisabled} on:click={() => (showModal = true)}>
    <span slot="text">{$t('play.game.buy-ships')}</span>
</ActionButton>

<Modal bind:showModal>
    <Subtitle slot="header">
        {$t('play.game.buy-ships-modal.title')}
        {selectedTerritory.territory.name}
    </Subtitle>

    <div class="flex flex-col gap-3">
        <p>{$t('play.game.total-infantry')}: {selectedTerritory.infantry}</p>
        <p>{$t('play.game.total-ships')}: {selectedTerritory.ships}</p>
    </div>
    <Form
        method="PATCH"
        action={`/api/game/${game.id}/actions/territory/${selectedTerritory.territory.code}/buy/ships`}
        hasBackground={false}
        isValid={canSubmit}
        isFormVisible={showModal}
        on:success={handleSuccess}
    >
        <Incrementation bind:value={amount} smallStep={5} smallShiftStep={10} largeStep={100} largeShiftStep={1000} {canDecrement} {canIncrement} name="amount" />

        <p class="text-center mt-4">
            {$t('play.game.will-cost')}
            <span class="text-primary-500 font-bold">
                {formatGameNumbers(cost)}
            </span>
        </p>
    </Form>
</Modal>
