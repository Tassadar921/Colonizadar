<script lang="ts">
	import { onMount } from 'svelte';
	import ThemeSwitch from '../shared/ThemeSwitch.svelte';
	import Button from '../shared/Button.svelte';
	import CommonMenu from './CommonMenu.svelte';
	import FlagMenu from './FlagMenu.svelte';
	import Burger from '../icons/Burger.svelte';
	import Close from '../icons/Close.svelte';

	let isOpen: boolean = false;

	let menuElement: HTMLElement;
	let buttonContainerElement: HTMLDivElement;

	const closeMenu = () => {
		isOpen = false;
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (!menuElement.contains(event.target as Node) && !buttonContainerElement.contains(event.target as Node)) {
			closeMenu();
		}
	};

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="relative z-20 flex justify-start">
	<div class="mt-3">
		<!-- Bind the button element reference -->
		<div bind:this={buttonContainerElement}>
			<Button idName="menu-button" customStyle className={`text-primary-500 hover:text-primary-800 duration-300 transition-colors ${isOpen ? 'opacity-0' : ''}`} on:click={() => (isOpen = !isOpen)}>
				<Burger />
			</Button>
		</div>

		<!-- Bind the menu element reference -->
		<nav
			id="menu"
			class="fixed top-0 left-0 w-64 h-full bg-gray-700 dark:bg-gray-800 text-white transform transition-transform duration-300 ease-in-out {isOpen ? '' : '-translate-x-full'}"
			style="z-index: 10000"
			bind:this={menuElement}
		>
			<div class="flex justify-between items-center p-4">
				<div class="flex gap-5 justify-center items-center">
					<ThemeSwitch />
					<div class="mt-2">
						<FlagMenu />
					</div>
				</div>
				<Button on:click={closeMenu}>
					<Close />
				</Button>
			</div>

			<CommonMenu on:click={closeMenu} />
		</nav>
	</div>
</div>
