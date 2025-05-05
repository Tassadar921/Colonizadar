<script lang="ts">
	import Button from './Button.svelte';
	import ChevronRight from '../icons/ChevronRight.svelte';
	import ArrowLeft from '../icons/ArrowLeft.svelte';
	import DoubleArrowLeft from '../icons/DoubleArrowLeft.svelte';
	import DoubleArrowRight from '../icons/DoubleArrowRight.svelte';

	export let value: number = 0;
	export let smallStep: number;
	export let largeStep: number;
	export let smallShiftStep: number;
	export let largeShiftStep: number;
	export let canDecrement: boolean;
	export let canIncrement: boolean;

	const handleClick = (event: MouseEvent, step: number, shiftStep: number, direction: 'inc' | 'dec'): void => {
		const appliedStep = event.shiftKey ? shiftStep : step;

		if (direction === 'dec' && canDecrement) {
			value = Math.max(smallStep, value - appliedStep);
		}

		if (direction === 'inc' && canIncrement) {
			value += appliedStep;
		}
	}
</script>

<div class="my-2 flex flex-row gap-3 justify-center items-center">
	<!-- Large Decrement -->
	<Button disabled={!canDecrement} on:click={(e) => handleClick(e, largeStep, largeShiftStep, 'dec')}>
		<DoubleArrowLeft />
	</Button>

	<!-- Small Decrement -->
	<Button disabled={!canDecrement} on:click={(e) => handleClick(e, smallStep, smallShiftStep, 'dec')}>
		<ArrowLeft />
	</Button>

	<!-- Value -->
	<p class="font-semibold min-w-[6rem] text-center">
		{value.toLocaleString()}
	</p>

	<!-- Small Increment -->
	<Button disabled={!canIncrement} on:click={(e) => handleClick(e, smallStep, smallShiftStep, 'inc')}>
		<ChevronRight />
	</Button>

	<!-- Large Increment -->
	<Button disabled={!canIncrement} on:click={(e) => handleClick(e, largeStep, largeShiftStep, 'inc')}>
		<DoubleArrowRight />
	</Button>
</div>
