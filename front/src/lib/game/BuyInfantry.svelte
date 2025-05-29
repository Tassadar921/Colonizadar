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
    let amount: number = 1000;
    let cost: number = 0;
    let showModal: boolean = false;
    let canSubmit: boolean = true;

    let canDecrement: boolean = true;
    let canIncrement: boolean = true;

    const getInfantryFromCost = (cost: number): number => {
        const rawAmount = (cost * 1000) / (game.map.baseInfantryCost * currentPlayer.country.infantryPriceFactor);
        return Math.floor(rawAmount / 1000);
    };

    const handleSuccess = async (event: CustomEvent): Promise<void> => {
        game = {
            ...game,
            players: game.players.map((player: SerializedRoomPlayer) => {
                if (event.detail.player.id === player.id) {
                    amount = 1000;
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
        amount = 1000;
        showToast(event.detail.message);
    };

    $: isButtonDisabled = (currentPlayer.gold ?? 0) < game.map.baseInfantryCost * currentPlayer.country.infantryPriceFactor * 1000;
    $: {
        const maxAffordableAmount = getInfantryFromCost(currentPlayer.gold ?? 0);

        if (amount > maxAffordableAmount) {
            amount = maxAffordableAmount;
            canIncrement = false;
        } else {
            canIncrement = amount + 1000 <= maxAffordableAmount;
        }

        cost = game.map.baseInfantryCost * currentPlayer.country.infantryPriceFactor * amount;
        canSubmit = amount >= 1000 && amount % 1000 === 0;
        canDecrement = amount > 1000;
    }
</script>

<ActionButton {isButtonDisabled} on:click={() => (showModal = true)}>
    <span slot="text">{$t('play.game.buy-infantry')}</span>
</ActionButton>

<Modal bind:showModal>
    <Subtitle slot="header">
        {$t('play.game.buy-infantry-modal.title')}
        {selectedTerritory.territory.name}
    </Subtitle>

    <div class="flex flex-col gap-3">
        <p>{$t('play.game.total-infantry')}: {selectedTerritory.infantry}</p>
        <p>{$t('play.game.total-ships')}: {selectedTerritory.ships}</p>
    </div>
    <Form
        method="PATCH"
        action={`/api/game/${game.id}/actions/territory/${selectedTerritory.territory.code}/buy/infantry`}
        hasBackground={false}
        isValid={canSubmit}
        isFormVisible={showModal}
        on:success={handleSuccess}
    >
        <Incrementation bind:value={amount} smallStep={1000} smallShiftStep={10000} largeStep={100000} largeShiftStep={1000000} {canDecrement} {canIncrement} name="amount" />

        <p class="text-center mt-4">
            {$t('play.game.will-cost')}
            <span class="text-primary-500 font-bold">
                {formatGameNumbers(cost)}
            </span>
        </p>
    </Form>
</Modal>
