<script lang="ts">
	import Button from './Button.svelte';
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';

	export let value: number = 0;
	export let smallStep: number;
	export let largeStep: number;
	export let smallShiftStep: number;
	export let largeShiftStep: number;
	export let canDecrement: boolean;
	export let canIncrement: boolean;
	export let name = '';

	const applyStep = (step: number, shiftStep: number, direction: 'inc' | 'dec', shiftKey: boolean) => {
		const appliedStep = shiftKey ? shiftStep : step;

		if (direction === 'dec' && canDecrement) {
			value = Math.max(smallStep, value - appliedStep);
		}

		if (direction === 'inc' && canIncrement) {
			value += appliedStep;
		}
	};

	const handleClick = (event: MouseEvent, step: number, shiftStep: number, direction: 'inc' | 'dec'): void => {
		applyStep(step, shiftStep, direction, event.shiftKey);
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		let direction: 'inc' | 'dec';
		let step: number;
		let shiftStep: number;

		switch (event.key) {
			case 'ArrowUp':
				direction = 'inc';
				step = smallStep;
				shiftStep = smallShiftStep;
				break;
			case 'ArrowDown':
				direction = 'dec';
				step = smallStep;
				shiftStep = smallShiftStep;
				break;
			case 'PageUp':
				direction = 'inc';
				step = largeStep;
				shiftStep = largeShiftStep;
				break;
			case 'PageDown':
				direction = 'dec';
				step = largeStep;
				shiftStep = largeShiftStep;
				break;
			default:
				return;
		}

		event.preventDefault();
		applyStep(step, shiftStep, direction, event.shiftKey);
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<input type="hidden" {name} {value} />

<div class="my-2 flex flex-row gap-3 justify-center items-center">
	<!-- Large Decrement -->
	<Button disabled={!canDecrement} on:click={(e) => handleClick(e, largeStep, largeShiftStep, 'dec')}>
		<Icon name="doubleArrowLeft" />
	</Button>

	<!-- Small Decrement -->
	<Button disabled={!canDecrement} on:click={(e) => handleClick(e, smallStep, smallShiftStep, 'dec')}>
		<Icon name="chevronLeft" />
	</Button>

	<!-- Value -->
	<p class="font-semibold min-w-[6rem] text-center">
		{value.toLocaleString()}
	</p>

	<!-- Small Increment -->
	<Button disabled={!canIncrement} on:click={(e) => handleClick(e, smallStep, smallShiftStep, 'inc')}>
		<Icon name="chevronRight" />
	</Button>

	<!-- Large Increment -->
	<Button disabled={!canIncrement} on:click={(e) => handleClick(e, largeStep, largeShiftStep, 'inc')}>
		<Icon name="doubleArrowRight" />
	</Button>
</div>
