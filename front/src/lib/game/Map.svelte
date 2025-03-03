<script>
    import WorldMap from './WorldMap.svelte';
    import { onDestroy, onMount } from 'svelte';

    let width;
    let height;
    let offsetX = 0;
    let offsetY = 0;

    let viewBox;
    let svgElement;
    let buttonElement;
    let minZoomLevel = 2;
    let maxZoomLevel = 10;
    let zoomLevel = minZoomLevel;
    let isDragging = false;
    let startX, startY;
    let hasDragged = false;

    const dragSensitivity = 1.3;

    onMount(() => {
        zoom(1);
        resizeButton();
        window.addEventListener('resize', resizeButton);
    });

    onDestroy(() => {
        window.removeEventListener('resize', resizeButton);
    });

    const resizeButton = () => {
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

        const dx = (event.clientX - startX) / (zoomLevel * dragSensitivity);
        const dy = (event.clientY - startY) / (zoomLevel * dragSensitivity);

        offsetX -= dx;
        offsetY -= dy;

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
        if (!hasDragged) {
            console.log('Valid click:', event.detail);
        }
    };
</script>

<button
    bind:this={buttonElement}
    class="max-h-full w-11/12 {isDragging ? 'cursor-grabbing' : 'cursor-pointer'}"
    on:wheel={handleWheel}
    on:mousedown={startDrag}
    on:mousemove={onDrag}
    on:mouseup={endDrag}
    on:mouseleave={endDrag}
    aria-label="Interactive world map"
>
    <WorldMap bind:svgElement bind:viewBox bind:width bind:height on:click={handleClick} />
</button>
