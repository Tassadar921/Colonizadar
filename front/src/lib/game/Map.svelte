<script>
    import WorldMap from './WorldMap.svelte';
    import { onDestroy, onMount } from 'svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import GamePlayer from './GamePlayer.svelte';

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

    let hoverColor = '#918b8b';
    let mountainColor = '#653a06';

    onMount(() => {
        svgElement.classList = 'rounded-lg bg-blue-800 border border-black dark:border-white box-content';

        handleResize();
        window.addEventListener('resize', handleResize);
        document.querySelectorAll('path').forEach((path) => {
            if (path.classList.contains('mountain')) {
                path.setAttribute('fill', mountainColor);
                return;
            }

            path.addEventListener('click', () => handleClick(path.id ? path.id : path.parentElement.id));
            path.addEventListener('mouseover', () => handleHover(path));
            path.addEventListener('mouseout', () => handleBlur(path));
        });
    });

    onDestroy(() => {
        window.removeEventListener('resize', handleResize);

        document.querySelectorAll('path').forEach((path) => {
            path.removeEventListener('click', () => handleClick(path.id ? path.id : path.parentElement.id));
            path.removeEventListener('mouseover', () => handleHover(path));
            path.removeEventListener('mouseout', () => handleBlur(path));
        });
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

    const handleClick = (territoryId) => {
        if (!hasDragged && territoryId) {
            const filteredTerritories = game.territories.filter((territoryObject) => {
                return territoryObject.territory.code.toLowerCase() === territoryId;
            });
            if (filteredTerritories.length > 0) {
                selectedTerritory = filteredTerritories[0];
                selectedTerritoryOwner = selectedTerritory.owner;
                showCountryModal = true;
            }
        }
    };

    const handleHover = (path) => {
        if (path.id) {
            path.setAttribute('fill', hoverColor);
        } else {
            path.parentElement.setAttribute('fill', hoverColor);
        }
    };

    const handleBlur = (path) => {
        if (showCountryModal) {
            return;
        }

        if (path.id) {
            path.removeAttribute('fill');
        } else {
            path.parentElement.removeAttribute('fill');
        }
    };

    $: if (selectedTerritory) {
        const territory = document.getElementById(selectedTerritory.territory.code.toLowerCase());
        if (territory) {
            if (showCountryModal) {
                territory.setAttribute('fill', hoverColor);
            } else {
                territory.removeAttribute('fill');
            }
        }
    }
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
    <WorldMap bind:svgElement bind:viewBox />
</button>

<Modal bind:showModal={showCountryModal}>
    <Subtitle slot="header">{selectedTerritory?.territory.name}</Subtitle>
    <div class="flex gap-5 items-center">
        <p>{$t('play.game.country-modal.owner')} :</p>
        <GamePlayer bind:game bind:player={selectedTerritoryOwner} />
    </div>
    <p>{$t('play.game.country-modal.troops')} : {selectedTerritory?.troops ?? '???'}</p>
    <p>{$t('play.game.country-modal.ships')} : {selectedTerritory?.ships ?? '???'}</p>
</Modal>
