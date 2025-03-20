<script>
    import WorldMap from './WorldMap.svelte';
    import { onDestroy, onMount } from 'svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import GamePlayer from "./GamePlayer.svelte";

    export let game;

    let width;
    let height;
    let offsetX = 0;
    let offsetY = 0;

    let viewBox;
    let svgElement;
    let buttonElement;
    let minZoomLevel = 2;
    let maxZoomLevel = 15;
    let zoomLevel = minZoomLevel;
    let isDragging = false;
    let startX, startY;
    let hasDragged = false;

    const dragSensitivity = 1.3;

    let selectedTerritoryOwner = null;
    let selectedTerritory = null;

    let showCountryModal = false;

    onMount(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
    });

    onDestroy(() => {
        window.removeEventListener('resize', handleResize);
    });

    const handleResize = () => {
        width = buttonElement.clientWidth;
        height = buttonElement.clientHeight;
        viewBox = `${offsetX} ${offsetY} ${width} ${height}`;
    };

    const zoom = (delta) => {
        zoomLevel *= delta;
        zoomLevel = Math.max(minZoomLevel, Math.min(maxZoomLevel, zoomLevel));

        const viewboxWidth = width / zoomLevel;
        const viewboxHeight = height / zoomLevel;

        viewBox = `${offsetX} ${offsetY} ${viewboxWidth} ${viewboxHeight}`;
    };

    const handleWheel = (event) => {
        event.preventDefault();
        const delta = event.deltaY > 0 ? 0.9 : 1.1;
        zoom(delta);
    };

    const startDrag = (event) => {
        isDragging = true;
        hasDragged = false;
        startX = event.clientX;
        startY = event.clientY;
    };

    const onDrag = (event) => {
        if (!isDragging) {
            return;
        }

        hasDragged = true;

        offsetX -= (event.clientX - startX) / (zoomLevel * dragSensitivity);
        offsetY -= (event.clientY - startY) / (zoomLevel * dragSensitivity);

        const viewboxWidth = width / zoomLevel;
        const viewboxHeight = height / zoomLevel;

        offsetX = Math.max(0, Math.min(width - viewboxWidth, offsetX));
        offsetY = Math.max(0, Math.min(height - viewboxHeight, offsetY));

        startX = event.clientX;
        startY = event.clientY;

        viewBox = `${offsetX} ${offsetY} ${viewboxWidth} ${viewboxHeight}`;
    };

    const endDrag = () => {
        isDragging = false;
    };

    const handleClick = (event) => {
        if (!hasDragged && event.detail) {
            const filteredTerritories = game.territories.filter((territoryObject) => {
                return territoryObject.territory.code.toLowerCase() === event.detail;
            });
            if (filteredTerritories.length > 0) {
                selectedTerritory = filteredTerritories[0];
                console.log(selectedTerritory);
                selectedTerritoryOwner = selectedTerritory.owner;
                showCountryModal = true;
            }
        }
    };
</script>

<button
    bind:this={buttonElement}
    class="h-full w-11/12 {isDragging ? 'cursor-grabbing' : 'cursor-pointer'}"
    on:wheel={handleWheel}
    on:mousedown={startDrag}
    on:mousemove={onDrag}
    on:mouseup={endDrag}
    on:mouseleave={endDrag}
    aria-label="Interactive world map"
>
    <WorldMap bind:svgElement bind:viewBox on:click={handleClick} />
</button>

<Modal bind:showModal={showCountryModal}>
    <Subtitle slot="header">{selectedTerritory?.territory.name}</Subtitle>
    <div><p>{$t('play.game.country-modal.owner')} : </p><GamePlayer bind:player={selectedTerritoryOwner} /></div>
    <p>{$t('play.game.country-modal.troops')} : { selectedTerritory?.troops ?? '???' }</p>
    <p>{$t('play.game.country-modal.ships')} : { selectedTerritory?.ships ?? '???' }</p>
</Modal>
