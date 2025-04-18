<script lang="ts">
	export let show: boolean = false;
	export let target: HTMLElement;

	let x: number = 0;
	let y: number = 0;
	let popover: HTMLElement;
	let popoverHeight: number = 0;

	$: if (popover) {
		popoverHeight = popover.offsetHeight || 0;
	}

	$: {
		if (target && show) {
			const { left, top, width, height } = target.getBoundingClientRect();
			const viewportHeight: number = window.innerHeight;

			const bottomY: number = top + height + 10;
			const isOffscreen: boolean = bottomY + popoverHeight > viewportHeight;

			x = left + width / 2;
			y = isOffscreen ? top - popoverHeight - 10 : bottomY;
		}
	}
</script>

{#if show}
	<div
		bind:this={popover}
		class="absolute text-center text-primary-500 bg-white border border-gray-300 p-2 rounded-md shadow-md z-50"
		style="position: fixed; left: {x}px; top: {y}px; transform: translate(-50%, 0);"
	>
		<slot />
	</div>
{/if}
