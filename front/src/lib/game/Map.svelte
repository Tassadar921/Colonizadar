<script lang="ts">
    import WorldMap from './WorldMap.svelte';
    import { onMount } from 'svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import InGamePlayer from './InGamePlayer.svelte';
    import { formatGameNumbers } from '../../services/stringService';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import { setHoverColor, resetTerritoryColor, setMountainColor, setIcons } from '../../services/gameGeometryService';
    import SpyTerritory from './SpyTerritory.svelte';
    import { profile } from '../../stores/profileStore';
    import FinanceWildTerritory from './FinanceWildTerritory.svelte';
    import FortifyTerritory from './FortifyTerritory.svelte';
    import BuyInfantry from './BuyInfantry.svelte';
    import BuyShips from './BuyShips.svelte';
    import SubvertWildTerritory from './SubvertWildTerritory.svelte';

    export let game: SerializedGame;
    export let currentPlayer: SerializedRoomPlayer;
    export let selectedTerritoryOwner: SerializedRoomPlayer;
    export let selectedTerritory: SerializedGameTerritory;

    let showCountryModal: boolean = false;

    let width: number = 500;
    let height: number = 300;
    let offsetX: number = 0;
    let offsetY: number = 0;

    let viewBox: string = '';
    let svgElement: SVGSVGElement;
    let minZoomLevel: number = 1;
    let maxZoomLevel: number = 15;
    let zoomLevel: number = minZoomLevel;
    let isDragging: boolean = false;
    let startX: number = 0;
    let startY: number = 0;
    let hasDragged: boolean = false;

    const dragSensitivity: number = 1.3;

    const checkedProfile = $profile!;

    onMount(() => {
        svgElement.classList.add('rounded-lg', 'bg-blue-950', 'border', 'border-black', 'dark:border-white', 'box-content');

        handleResize();
        window.addEventListener('resize', handleResize);
        document.querySelectorAll('.mainland').forEach((path): void => {
            const svgGroup = path.parentElement! as unknown as SVGGElement;
            if (svgGroup.classList.contains('mountain')) {
                setMountainColor(svgGroup);
                return;
            }

            svgGroup.addEventListener('click', () => handleClick(svgGroup.id));
            svgGroup.addEventListener('mouseover', () => setHoverColor(svgGroup));
            svgGroup.addEventListener('mouseout', () => handleBlur(svgGroup));
        });

        return (): void => {
            window.removeEventListener('resize', handleResize);

            document.querySelectorAll('.mainland').forEach((path): void => {
                const svgGroup = path.parentElement! as unknown as SVGGElement;

                path.removeEventListener('click', () => handleClick(svgGroup.id));
                path.removeEventListener('mouseover', () => setHoverColor(svgGroup));
                path.removeEventListener('mouseout', () => handleBlur(svgGroup));
            });
        };
    });

    const handleResize = (): void => {
        viewBox = `${offsetX} ${offsetY} ${width} ${height}`;
    };

    const zoom = (delta: number, cursorX: number, cursorY: number): void => {
        const svgRect = svgElement.getBoundingClientRect();

        const mouseX: number = cursorX - svgRect.left;
        const mouseY: number = cursorY - svgRect.top;

        const svgX: number = offsetX + (mouseX / svgRect.width) * (width / zoomLevel);
        const svgY: number = offsetY + (mouseY / svgRect.height) * (height / zoomLevel);

        zoomLevel *= delta;
        zoomLevel = Math.max(minZoomLevel, Math.min(maxZoomLevel, zoomLevel));

        const newViewboxWidth: number = width / zoomLevel;
        const newViewboxHeight: number = height / zoomLevel;

        offsetX = svgX - (mouseX / svgRect.width) * newViewboxWidth;
        offsetY = svgY - (mouseY / svgRect.height) * newViewboxHeight;

        viewBox = `${offsetX} ${offsetY} ${newViewboxWidth} ${newViewboxHeight}`;
    };

    const handleWheel = (event: WheelEvent): void => {
        event.preventDefault();
        const delta: number = event.deltaY > 0 ? 0.9 : 1.1;
        zoom(delta, event.clientX, event.clientY);
    };

    const startDrag = (event: MouseEvent): void => {
        isDragging = true;
        hasDragged = false;
        startX = event.clientX;
        startY = event.clientY;
    };

    const onDrag = (event: MouseEvent): void => {
        if (!isDragging) {
            return;
        }

        hasDragged = true;

        offsetX -= (event.clientX - startX) / (zoomLevel * dragSensitivity);
        offsetY -= (event.clientY - startY) / (zoomLevel * dragSensitivity);

        const viewboxWidth: number = width / zoomLevel;
        const viewboxHeight: number = height / zoomLevel;

        startX = event.clientX;
        startY = event.clientY;

        viewBox = `${offsetX} ${offsetY} ${viewboxWidth} ${viewboxHeight}`;
    };

    const endDrag = (): void => {
        isDragging = false;
    };

    const handleClick = (territoryId: string): void => {
        if (!hasDragged && territoryId) {
            const gameTerritory: SerializedGameTerritory | undefined = game.territories.find((gameTerritory): boolean => {
                return gameTerritory.territory.code.toLowerCase() === territoryId;
            });
            if (gameTerritory) {
                selectedTerritory = gameTerritory;
                selectedTerritoryOwner = selectedTerritory.owner;
                showCountryModal = true;
            }
        }
    };

    const handleBlur = (svgGroup: SVGGElement): void => {
        if (!game || showCountryModal) {
            return;
        }

        resetTerritoryColor(game, svgGroup!);
    };

    $: if (selectedTerritory) {
        const svgGroup = document.getElementById(selectedTerritory.territory.code.toLowerCase()) as unknown as SVGGElement;
        if (svgGroup) {
            if (showCountryModal) {
                setHoverColor(svgGroup);
            } else {
                resetTerritoryColor(game, svgGroup);
            }
        }
    }

    $: if (game) {
        svgElement?.querySelectorAll('.flag-icon').forEach((el) => el.remove());
        svgElement?.querySelectorAll('.factory-icon').forEach((el) => el.remove());
        svgElement?.querySelectorAll('.fortified-icon').forEach((el) => el.remove());

        for (const gameTerritory of game.territories) {
            const svgGroup: SVGGElement | null = document.getElementById(gameTerritory.territory.code.toLowerCase()) as unknown as SVGGElement | null;
            const mainSvgPath: SVGPathElement | null = svgGroup?.querySelector('.mainland') as SVGPathElement | null;

            if (!svgGroup || !mainSvgPath) {
                continue;
            }

            setIcons(game, gameTerritory, svgGroup, mainSvgPath, svgElement);
        }
    }
</script>

<button
    class="w-4/5 overflow-hidden {isDragging ? 'cursor-grabbing' : 'cursor-pointer'}"
    on:wheel={handleWheel}
    on:mousedown={startDrag}
    on:mousemove={onDrag}
    on:mouseup={endDrag}
    on:mouseleave={endDrag}
    aria-label="Interactive world map"
>
    <WorldMap bind:svgElement bind:viewBox />
</button>

{#if selectedTerritory}
    <Modal bind:showModal={showCountryModal}>
        <Subtitle slot="header">{selectedTerritory.territory.name}</Subtitle>
        <div class="flex gap-1 items-center">
            <p>{$t('play.game.country-modal.owner')} :</p>
            <InGamePlayer bind:game bind:player={selectedTerritoryOwner} />
        </div>
        <p>{$t('play.game.country-modal.value')} : {formatGameNumbers(selectedTerritory.value ?? 0)}</p>
        <p>{$t('play.common.infantry')} : {selectedTerritory.infantry ? formatGameNumbers(selectedTerritory.infantry) : '???'}</p>
        {#if selectedTerritory && selectedTerritoryOwner && selectedTerritory.territory.isCoastal}
            <p>{$t('play.common.ships')} : {typeof selectedTerritory.ships === 'number' ? formatGameNumbers(selectedTerritory.ships) : '???'}</p>
        {/if}
        <p>{$t('play.game.fortified')} : {selectedTerritory.isFortified}</p>
        <div class="flex gap-5 justify-center">
            {#if game.map.mainSeason === game.season && selectedTerritory}
                {#if selectedTerritoryOwner?.user?.id !== checkedProfile.id}
                    <SpyTerritory bind:game bind:selectedTerritory {currentPlayer} />
                    {#if !selectedTerritoryOwner}
                        <FinanceWildTerritory bind:game bind:selectedTerritory {currentPlayer} />
                        <SubvertWildTerritory bind:game bind:selectedTerritory {currentPlayer} />
                    {/if}
                {:else if !selectedTerritory.isFortified}
                    <FortifyTerritory bind:game {selectedTerritory} {currentPlayer} />
                {:else if selectedTerritory.territory.isFactory}
                    <BuyInfantry bind:game bind:selectedTerritory {currentPlayer} />
                    <BuyShips bind:game bind:selectedTerritory {currentPlayer} />
                {/if}
            {/if}
        </div>
    </Modal>
{/if}
