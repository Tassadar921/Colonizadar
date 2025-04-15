<script lang="ts">
    import WorldMap from './WorldMap.svelte';
    import { onMount } from 'svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import GamePlayer from './GamePlayer.svelte';
    import { formatGameNumbers } from '../../services/stringService';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';

    export let game: SerializedGame;

    let width: number = 500;
    let height: number = 300;
    let offsetX: number = 0;
    let offsetY: number = 0;

    let viewBox: string = '';
    let svgElement: SVGSVGElement;
    let minZoomLevel: number = 2;
    let maxZoomLevel: number = 15;
    let zoomLevel: number = minZoomLevel;
    let isDragging: boolean = false;
    let startX: number = 0;
    let startY: number = 0;
    let hasDragged: boolean = false;

    const dragSensitivity: number = 1.3;

    let selectedTerritoryOwner: SerializedRoomPlayer;
    let selectedTerritory: SerializedGameTerritory;

    let showCountryModal: boolean = false;

    let hoverColor: string = '#ffffac';
    let mountainColor: string = '#653a06';

    onMount(() => {
        svgElement.classList.add('rounded-lg', 'bg-blue-950', 'border', 'border-black', 'dark:border-white', 'box-content');

        handleResize();
        window.addEventListener('resize', handleResize);
        document.querySelectorAll('path').forEach((path) => {
            if (path.classList.contains('mountain')) {
                path.setAttribute('fill', mountainColor);
                return;
            }

            path.addEventListener('click', () => handleClick(path.id ? path.id : path.parentElement!.id));
            path.addEventListener('mouseover', () => handleHover(path));
            path.addEventListener('mouseout', () => handleBlur(path));
        });

        return (): void => {
            window.removeEventListener('resize', handleResize);

            document.querySelectorAll('path').forEach((path) => {
                path.removeEventListener('click', () => handleClick(path.id ? path.id : path.parentElement!.id));
                path.removeEventListener('mouseover', () => handleHover(path));
                path.removeEventListener('mouseout', () => handleBlur(path));
            });
        };
    });

    const handleResize = (): void => {
        viewBox = `${offsetX} ${offsetY} ${width} ${height}`;
    };

    const zoom = (delta: number): void => {
        zoomLevel *= delta;
        zoomLevel = Math.max(minZoomLevel, Math.min(maxZoomLevel, zoomLevel));

        const viewboxWidth: number = width / zoomLevel;
        const viewboxHeight: number = height / zoomLevel;

        viewBox = `${offsetX} ${offsetY} ${viewboxWidth} ${viewboxHeight}`;
    };

    const handleWheel = (event: WheelEvent): void => {
        event.preventDefault();
        const delta: number = event.deltaY > 0 ? 0.9 : 1.1;
        zoom(delta);
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

        offsetX = Math.max(0, Math.min(width - viewboxWidth, offsetX));
        offsetY = Math.max(0, Math.min(height - viewboxHeight, offsetY));

        startX = event.clientX;
        startY = event.clientY;

        viewBox = `${offsetX} ${offsetY} ${viewboxWidth} ${viewboxHeight}`;
    };

    const endDrag = (): void => {
        isDragging = false;
    };

    const handleClick = (territoryId: string): void => {
        if (!hasDragged && territoryId) {
            const filteredTerritories: SerializedGameTerritory[] = game.territories.filter((territoryObject): boolean => {
                return territoryObject.territory.code.toLowerCase() === territoryId;
            });
            if (filteredTerritories.length > 0) {
                selectedTerritory = filteredTerritories[0];
                selectedTerritoryOwner = selectedTerritory.owner;
                showCountryModal = true;
            }
        }
    };

    const handleHover = (path: SVGPathElement): void => {
        if (path.id) {
            path.setAttribute('fill', hoverColor);
        } else {
            path.parentElement!.setAttribute('fill', hoverColor);
        }
    };

    const handleBlur = (path: SVGPathElement): void => {
        if (showCountryModal) {
            return;
        }

        resetTerritoryColor(path.id ? path : path.parentElement!);
    };

    const resetTerritoryColor = (graphicalTerritory: HTMLElement | SVGPathElement): void => {
        const filteredTerritories = game.territories.filter((territoryObject): string => {
            return territoryObject.territory.code.toLowerCase() === graphicalTerritory.id ? graphicalTerritory.id : graphicalTerritory.parentElement!.id;
        });
        if (filteredTerritories.length > 0) {
            if (filteredTerritories[0].owner) {
                graphicalTerritory.setAttribute('fill', filteredTerritories[0].owner.country.color);
            } else {
                graphicalTerritory.removeAttribute('fill');
            }
        }
    };

    $: if (selectedTerritory) {
        const territory = document.getElementById(selectedTerritory.territory.code.toLowerCase());
        if (territory) {
            if (showCountryModal) {
                territory.setAttribute('fill', hoverColor);
            } else {
                resetTerritoryColor(territory);
            }
        }
    }

    $: if (game) {
        for (const territoryObject of game.territories) {
            if (!territoryObject.owner) continue;

            const graphicalTerritory = document.getElementById(territoryObject.territory.code.toLowerCase());
            if (!graphicalTerritory) continue;

            graphicalTerritory.setAttribute('fill', territoryObject.owner.country.color);

            // Select the good path : path or .mainland into a <g>
            let path: SVGPathElement = graphicalTerritory.tagName === 'path' ? (graphicalTerritory as unknown as SVGPathElement) : (graphicalTerritory.querySelector('.mainland') as SVGPathElement);
            const bbox = path.getBBox();
            const x = bbox.x + bbox.width / 2;
            const y = bbox.y + bbox.height / 2;

            // Create an icon and place it
            // TODO: debug flag placement
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            icon.setAttribute('href', `${import.meta.env.VITE_API_BASE_URL}/api/static/country-flag/${territoryObject.owner.country.id}?token=${localStorage.getItem('apiToken')}`);
            icon.setAttribute('width', '15');
            icon.setAttribute('height', '15');
            icon.setAttribute('x', String(x - 7.5));
            icon.setAttribute('y', String(y - 7.5));

            svgElement.appendChild(icon);
        }
    }
</script>

<button
    class="width-map overflow-hidden {isDragging ? 'cursor-grabbing' : 'cursor-pointer'}"
    on:wheel={handleWheel}
    on:mousedown={startDrag}
    on:mousemove={onDrag}
    on:mouseup={endDrag}
    on:mouseleave={endDrag}
    aria-label="Interactive world map"
>
    <WorldMap bind:svgElement bind:viewBox />
</button>

<Modal bind:showModal={showCountryModal}>
    <Subtitle slot="header">{selectedTerritory?.territory.name}</Subtitle>
    <div class="flex gap-1 items-center">
        <p>{$t('play.game.country-modal.owner')} :</p>
        <GamePlayer bind:game bind:player={selectedTerritoryOwner} />
    </div>
    <p>{$t('play.game.country-modal.value')} : {formatGameNumbers(selectedTerritory?.value ?? 0)}</p>
    <p>{$t('play.game.country-modal.infantry')} : {selectedTerritory?.power ? formatGameNumbers(selectedTerritory.power) : '???'}</p>
    {#if selectedTerritory && selectedTerritoryOwner && selectedTerritory.territory.isCoastal}
        <p>{$t('play.game.country-modal.ships')} : {selectedTerritory?.ships ?? '???'}</p>
    {/if}
</Modal>

<style>
    .width-map {
        width: 79%;
    }
</style>
