<script lang="ts">
    import WorldMap from './WorldMap.svelte';
    import { onMount } from 'svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import { setHoverColor, resetTerritoryColor, setMountainColor, setIcons, getNeighboursGroups, setFlashColor } from '../../services/gameGeometryService';
    import SelectedTerritoryModalContent from './SelectedTerritoryModalContent.svelte';
    import { t } from 'svelte-i18n';
    import MoveModalContent from './MoveModalContent.svelte';

    export let game: SerializedGame;
    export let currentPlayer: SerializedRoomPlayer;
    export let selectedTerritoryOwner: SerializedRoomPlayer;
    export let selectedTerritory: SerializedGameTerritory;

    let showCountryModal: boolean = false;
    let showMoveModal: boolean = false;

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

    let interval: NodeJS.Timeout | undefined;
    let neighbours: SVGGElement[] = [];
    let neighboursSet: Set<string>;
    let isFlashColor: boolean = false;

    let isAttacking: boolean = false;
    let targetTerritory: SerializedGameTerritory;
    let moveInfantryAmount: number;
    let moveShipsAmount: number;

    const dragSensitivity: number = 1.3;

    onMount(() => {
        svgElement.classList.add('rounded-lg', 'bg-blue-600', 'border', 'border-black', 'dark:border-white', 'box-content');

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
        const newViewboxWidth: number = width / zoomLevel;
        const newViewboxHeight: number = height / zoomLevel;

        viewBox = `${offsetX} ${offsetY} ${newViewboxWidth} ${newViewboxHeight}`;
    };

    const zoom = (delta: number, cursorX: number, cursorY: number): void => {
        const svgRect: DOMRect = svgElement.getBoundingClientRect();

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
        if (interval) {
            clearInterval(interval);
            interval = undefined;
            isFlashColor = false;
            for (const neighbour of neighbours) {
                resetTerritoryColor(game, neighbour);
            }
            if (neighboursSet.has(territoryId)) {
                const gameTerritory: SerializedGameTerritory | undefined = game.territories.find((gameTerritory): boolean => {
                    return gameTerritory.territory.code.toLowerCase() === territoryId;
                });
                if (!gameTerritory) {
                    return;
                }

                targetTerritory = gameTerritory;
                if (gameTerritory.owner?.id === currentPlayer.id) {
                    isAttacking = false;
                } else {
                    isAttacking = true;
                }
                showMoveModal = true;
            }
        } else {
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
        }
    };

    const handleBlur = (svgGroup: SVGGElement): void => {
        if (!game || showCountryModal) {
            return;
        }

        if (interval && isFlashColor) {
            setFlashColor(game, svgGroup, isFlashColor);
        } else {
            resetTerritoryColor(game, svgGroup);
        }
    };

    const handleMoveClicked = (): void => {
        showCountryModal = false;
        interval = setInterval(() => {
            isFlashColor = !isFlashColor;
            for (const neighbour of neighbours) {
                setFlashColor(game, neighbour, isFlashColor);
            }
        }, 750);
    };

    const handleCloseMoveModal = (): void => {
        moveInfantryAmount = 0;
        moveShipsAmount = 0;
    };

    $: if (selectedTerritory) {
        const svgGroup = document.getElementById(selectedTerritory.territory.code.toLowerCase()) as unknown as SVGGElement;
        ({ neighbours, neighboursSet } = getNeighboursGroups(game, selectedTerritory));

        if (svgGroup) {
            if (showCountryModal) {
                setHoverColor(svgGroup);
            } else {
                resetTerritoryColor(game, svgGroup);
            }
        }
    }

    $: if (game) {
        setIcons(svgElement, game);
    }
</script>

<button
    class="w-4/5 overflow-hidden {isDragging ? 'cursor-grabbing' : ''}"
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
        <SelectedTerritoryModalContent bind:game bind:selectedTerritory bind:selectedTerritoryOwner {currentPlayer} on:move={handleMoveClicked} />
    </Modal>
{/if}

{#if targetTerritory}
    <Modal bind:showModal={showMoveModal} on:close={handleCloseMoveModal}>
        <Subtitle slot="header">{isAttacking ? $t('play.game.attacking') : $t('play.game.moving')} {targetTerritory.territory.name}</Subtitle>
        <MoveModalContent bind:selectedTerritory {targetTerritory} {isAttacking} bind:infantryAmount={moveInfantryAmount} bind:shipsAmount={moveShipsAmount} />
    </Modal>
{/if}
