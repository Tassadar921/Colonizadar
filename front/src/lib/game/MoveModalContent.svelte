<script lang="ts">
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import Form from '../shared/Form.svelte';
    import Range from '../shared/Range.svelte';
    import { t } from 'svelte-i18n';
    import Icon from '../shared/Icon.svelte';
    import ActionButton from './ActionButton.svelte';
    import type SerializedTerritory from 'colonizadar-backend/app/types/serialized/serialized_territory';
    import Incrementation from '../shared/Incrementation.svelte';

    export let selectedTerritory: SerializedGameTerritory;
    export let targetTerritory: SerializedGameTerritory;
    export let isAttacking: boolean;
    export let infantryAmount: number;
    export let shipsAmount: number;

    let isNeighbour: boolean = false;
    let isCoastal: boolean = false;

    let isButtonDisabled: boolean = false;
    let isLoading: boolean = false;
    let iconName: 'attack' | 'move' = 'move';

    let canDecrementInfantry: boolean = true;
    let canIncrementInfantry: boolean = true;

    let canDecrementShips: boolean = true;
    let canIncrementShips: boolean = true;

    const handleMove = async (): Promise<void> => {};

    $: isNeighbour = !!selectedTerritory.territory.neighbours.find((neighbour: SerializedTerritory): boolean => neighbour.code === targetTerritory.territory.code);
    $: isCoastal = selectedTerritory.territory.isCoastal && targetTerritory.territory.isCoastal;
    $: iconName = isAttacking ? 'attack' : 'move';
    $: {
        isButtonDisabled =
            isLoading ||
            (!infantryAmount && (!isCoastal || !shipsAmount)) ||
            infantryAmount % 1000 !== 0 ||
            (isCoastal && shipsAmount % 5 !== 0) ||
            (selectedTerritory.infantry ?? 0) < infantryAmount ||
            (isCoastal && (selectedTerritory.ships ?? 0) < shipsAmount);

        const maxInfantry: number = selectedTerritory.infantry ?? 0;
        if (isCoastal) {
            if (infantryAmount > shipsAmount * 1000 || infantryAmount > maxInfantry) {
                infantryAmount = Math.min(shipsAmount * 1000, maxInfantry);
            }
        } else {
            if (infantryAmount > maxInfantry) {
                infantryAmount = maxInfantry;
            }
        }

        if (isCoastal && shipsAmount > (selectedTerritory.ships ?? 0)) {
            shipsAmount = selectedTerritory.ships ?? 0;
        }
        canDecrementInfantry = infantryAmount > 0;
        canIncrementInfantry = infantryAmount < (isNeighbour ? (selectedTerritory.infantry ?? 0) : shipsAmount * 1000);
        canDecrementShips = shipsAmount > 0;
        canIncrementShips = shipsAmount < (selectedTerritory.ships ?? 0);
    }
</script>

<Form submittable={false} hasBackground={false}>
    <Range name="amount" bind:value={infantryAmount} min={0} max={isNeighbour ? selectedTerritory.infantry : shipsAmount * 1000} step={1000} label={$t('play.common.infantry')} />
    <Incrementation
        bind:value={infantryAmount}
        smallStep={1000}
        smallShiftStep={10000}
        largeStep={100000}
        largeShiftStep={1000000}
        canDecrement={canDecrementInfantry}
        canIncrement={canIncrementInfantry}
        canBeZero={true}
    />
    {#if isCoastal}
        <Range name="amount" bind:value={shipsAmount} min={0} max={selectedTerritory.ships} step={5} label={$t('play.common.ships')} />
        <Incrementation
            bind:value={shipsAmount}
            smallStep={5}
            smallShiftStep={10}
            largeStep={100}
            largeShiftStep={1000}
            canDecrement={canDecrementShips}
            canIncrement={canIncrementShips}
            canBeZero={true}
        />
    {/if}

    <div class="flex justify-end pr-3">
        <ActionButton {isButtonDisabled} {isLoading} on:click={handleMove}>
            <span slot="text" class="flex gap-3">
                {isAttacking ? $t('play.game.attack') : $t('play.game.move')}
                <Icon name={iconName} />
            </span>
        </ActionButton>
    </div>
</Form>
