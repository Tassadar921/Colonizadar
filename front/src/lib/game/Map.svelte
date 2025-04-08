<script>
    import WorldMap from './WorldMap.svelte';
    import { onDestroy, onMount } from 'svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import GamePlayer from './GamePlayer.svelte';
    import { formatGameTerritoryPowerAndShips } from '../../services/stringService.js';

    export let game;

    let width = 500;
    let height = 300;
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

    let hoverColor = '#ffffac';
    let mountainColor = '#653a06';

    onMount(() => {
        svgElement.classList = 'rounded-lg bg-blue-950 border border-black dark:border-white box-content';

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
                console.log(selectedTerritory.territory);
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

        resetTerritoryColor(path.id ? path : path.parentElement);
    };

    const resetTerritoryColor = (graphicalTerritory) => {
        const filteredTerritories = game.territories.filter((territoryObject) => {
            return territoryObject.territory.code.toLowerCase() === graphicalTerritory.id ? graphicalTerritory.id : graphicalTerritory.parentElement.id;
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

            // Sélectionner le bon chemin : path ou .mainland dans un <g>
            let path = graphicalTerritory.tagName === 'path' ? graphicalTerritory : graphicalTerritory.querySelector('.mainland');

            const bbox = path.getBBox();
            const x = bbox.x + bbox.width / 2;
            const y = bbox.y + bbox.height / 2;

            // Créer une icône et la placer
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            icon.setAttribute('href', `${process.env.VITE_API_BASE_URL}/api/static/country-flag/${territoryObject.owner.country.id}?token=${localStorage.getItem('apiToken')}`);
            icon.setAttribute('width', '15');
            icon.setAttribute('height', '15');
            icon.setAttribute('x', x - 7.5);
            icon.setAttribute('y', y - 7.5);

            svgElement.appendChild(icon);
        }
    }
</script>

<button
    bind:this={buttonElement}
    class="width-map max-h-[75%] overflow-hidden {isDragging ? 'cursor-grabbing' : 'cursor-pointer'}"
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
    <p>{$t('play.game.country-modal.infantry')} : {selectedTerritory?.power ? formatGameTerritoryPowerAndShips(selectedTerritory.power * 1000) : '???'}</p>
    {#if selectedTerritory && selectedTerritoryOwner && selectedTerritory.territory.isCoastal}
        <p>{$t('play.game.country-modal.ships')} : {selectedTerritory?.ships ?? '???'}</p>
    {/if}
</Modal>
