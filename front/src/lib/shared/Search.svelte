<script lang="ts">
	import { t } from 'svelte-i18n';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let search: string = '';
	export let placeholder: string | null = null;
	export let debounce: number = 300;
	export let minChars: number | null = null;
	export let name: string = '';
	export let disabled: boolean = false;
	export let label: string = '';
	export let selected: boolean = false;
	export let results: any[] = [];
	export let selectedObserver: boolean = false;

	let searchTimeout: NodeJS.Timeout | null = null;
	let focused: boolean = false;

	const searchFunction = async (): Promise<void> => {
		if (minChars && search.length < minChars) {
			results = [];
			return;
		}
		dispatch('search');
	};

	const searchDebounced = (event: KeyboardEvent): void => {
		clearTimeout(searchTimeout);

		if (event.key === 'Enter') {
			event.preventDefault();
			dispatch('search', true);
		} else {
			searchTimeout = setTimeout(searchFunction, debounce);
		}
	};

	const handleFocus = (): void => {
		focused = true;
		dispatch('focus');
	};

	const handleBlur = (): void => {
		focused = false;
		dispatch('blur');
	};

	$: placeholder = placeholder ?? $t('common.search');

	$: if (selectedObserver && selected) {
		name.focus();
	}
</script>

<div class="relative w-full mt-8">
	<label
		for={name}
		class="absolute pointer-events-none z-10 transition-all duration-800 ease-in-out {focused || search.length ? 'text-primary-500 bottom-11 left-1' : 'text-gray-500 bottom-2.5 left-3'}"
	>
		{label}
	</label>
	<input
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:keydown={searchDebounced}
		type="search"
		bind:value={search}
		bind:this={name}
		placeholder={focused || search.length ? placeholder : ''}
		{name}
		{disabled}
		class="block w-full px-3 py-2 mt-1 text-base text-gray-800 placeholder-gray-500 border border-gray-300 rounded-md
            shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
	/>
</div>

<style>
	label {
		transition:
			bottom 0.8s ease,
			left 0.8s ease,
			color 0.8s ease;
	}
</style>
