<script>
    import WorldMap from './WorldMap.svelte';

    const mapWidth = 550;
    const mapHeight = 350;

    let offsetX = 0;
    let offsetY = 0;
    let viewBox = `${offsetX} ${offsetY} ${mapWidth} ${mapHeight}`;
    let svgElement;
    let buttonElement;
    let zoomLevel = 1;
    let isDragging = false;
    let startX, startY;

    const dragSensitivity = 2;

    const zoom = (delta) => {
        zoomLevel *= delta;
        zoomLevel = Math.max(1, Math.min(20, zoomLevel));

        const width = mapWidth / zoomLevel;
        const height = mapHeight / zoomLevel;

        viewBox = `${offsetX} ${offsetY} ${width} ${height}`;
    };

    const handleWheel = (event) => {
        event.preventDefault();
        const delta = event.deltaY > 0 ? 0.9 : 1.1;
        zoom(delta);
    };

    const startDrag = (event) => {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
    };

    const onDrag = (event) => {
        if (!isDragging) {
            return;
        }

        const dx = (event.clientX - startX) / (zoomLevel * dragSensitivity);
        const dy = (event.clientY - startY) / (zoomLevel * dragSensitivity);

        offsetX -= dx;
        offsetY -= dy;

        const width = mapWidth / zoomLevel;
        const height = mapHeight / zoomLevel;

        offsetX = Math.max(0, Math.min(mapWidth - width, offsetX));
        offsetY = Math.max(0, Math.min(mapHeight - height, offsetY));

        startX = event.clientX;
        startY = event.clientY;

        viewBox = `${offsetX} ${offsetY} ${width} ${height}`;
    };

    const endDrag = () => {
        isDragging = false;
    };

    $: if (svgElement) {
        buttonElement.style.width = `${window.innerWidth - 100}px`;
        buttonElement.style.maxHeight = `${window.innerHeight - 100}px`;
    }
</script>

<button
    bind:this={buttonElement}
    class="cursor-grab"
    on:wheel={handleWheel}
    on:mousedown={startDrag}
    on:mousemove={onDrag}
    on:mouseup={endDrag}
    on:mouseleave={endDrag}
    aria-label="Interactive world map"
>
    <WorldMap bind:svgElement bind:viewBox />
</button>
