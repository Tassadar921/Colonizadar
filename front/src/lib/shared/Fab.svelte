<script lang="ts">
	import Icon from './Icon.svelte';

	export let horizontal: Props['horizontal'] = 'right';
	export let vertical: Props['vertical'] = 'bottom';
	export let icon: string = '';
	export let color: keyof typeof colorClasses = 'primary';
	export let ariaLabel: string;
	export let isLoading: boolean = false;

	interface Props {
		horizontal: 'right' | 'left' | 'middle';
		vertical: 'top' | 'bottom' | 'center';
	}

	const horizontalClasses = {
		right: 'right-4',
		left: 'left-4',
		middle: 'left-1/2 transform -translate-x-1/2',
	};

	const verticalClasses = {
		top: 'top-4',
		bottom: 'bottom-4',
		center: 'top-1/2 transform -translate-y-1/2',
	};

	const colorClasses = {
		red: 'bg-red-500 hover:bg-red-900',
		green: 'bg-green-500 hover:bg-green-900',
		blue: 'bg-blue-500 hover:bg-blue-900',
		primary: 'bg-indigo-500 hover:bg-indigo-900',
		gray: 'bg-gray-500 hover:bg-gray-900',
	};

	const validHorizontal = ['right', 'left', 'middle'];
	const validVertical = ['top', 'bottom', 'center'];

	$: horizontal = validHorizontal.includes(horizontal) ? horizontal : 'right';
	$: vertical = validVertical.includes(vertical) ? vertical : 'bottom';

	$: buttonClasses = `text-white shadow-lg flex items-center justify-center fixed size-10 rounded-full
        transition-colors duration-300
        ${verticalClasses[vertical]}
        ${horizontalClasses[horizontal]}
        ${colorClasses[color] ?? colorClasses['primary']}`;
</script>

<button on:click aria-label={ariaLabel} style="z-index: 5000" class={buttonClasses} disabled={isLoading}>
	<Icon name={isLoading ? 'spinner' : icon} {...isLoading ? { size: 30 } : {}} />
</button>
