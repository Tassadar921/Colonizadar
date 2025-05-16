<script lang="ts">
	import { location } from '../../stores/locationStore';
	import Link from '../shared/Link.svelte';
    import Icon from "../shared/Icon.svelte";

	export let href: string = '';
	export let footer: boolean = false;
	export let target: string = '';

	let notClickable: boolean = true;

	$: notClickable = href === $location;
</script>

<Link
	href={notClickable ? undefined : href}
	className={`${!notClickable ? (footer ? 'hover:bg-gray-400' : 'hover:bg-gray-600') : 'cursor-not-allowed opacity-50'} ${footer ? 'flex justify-center' : ''} px-2 flex flex-row transition-colors duration-300 rounded ${notClickable ? '' : 'cursor-pointer dark:hover:bg-gray-700'}`}
	{target}
	on:click
>
	<div class="text-primary-500 left">
		<slot name="iconLeft" />
	</div>
	<span class="{footer ? 'text-black dark:text-white' : 'text-white text-xl'} text-nowrap p-2">
		<slot />
	</span>
	<div class="dark:text-white right">
        <Icon name="chevronRight" />
	</div>
</Link>

<style>
	.left {
		margin-top: 0.5rem;
	}
	.right {
		margin-top: 0.55rem;
	}
</style>
