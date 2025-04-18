<script lang="ts">
	import IconButton from './IconButton.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let className: string = '';
	export let iconClassName: string = '';
	export let value: string = '';
	export let min: number = 3;
	export let max: number = 100;
	export let editable: boolean = true;

	let editing: boolean = false;
	let icon: string = 'pen';
	let inputElement: HTMLInputElement;
	let message: string = '';
	let initialValue: string = value;

	const checkValue = (): boolean => {
		if (value.length < min || value.length > max) {
			message = `The value must be between ${min} and ${max} characters`;
			return false;
		} else {
			message = '';
			return true;
		}
	};

	const handleKeyDown = (event: KeyboardEvent): void => {
		if ((event.key === 'Enter' || event.key === 'Escape' || event.key === 'Tab') && checkValue()) {
			editing = false;
			if (value !== initialValue) {
				dispatch('rename', { value });
			}
		}
	};

	const handleBlur = (): void => {
		if (checkValue()) {
			if (value !== initialValue) {
				dispatch('rename', { value });
			}
		} else {
			message = '';
			value = initialValue;
		}
		editing = false;
	};

	const handleIconClick = (): void => {
		if (editable) {
			editing = !editing;
			if (editing) {
				initialValue = value;
			}
		}
	};

	$: icon = editing ? 'check' : 'pen';
	$: if (editing && inputElement) {
		inputElement.focus();
	}
</script>

<div class="flex flex-row gap-3">
	{#if editing}
		<input bind:this={inputElement} class={`${className} bg-transparent dark:text-white`} type="text" bind:value on:keydown={handleKeyDown} on:blur={handleBlur} />
	{:else}
		<slot />
	{/if}

	{#if editable}
		<div class={iconClassName}>
			<IconButton bind:icon on:click={handleIconClick} />
		</div>
	{/if}
</div>
<p class="text-primary-500 text-xs">{message}</p>
