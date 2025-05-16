<script lang="ts">
	import Button from './Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import Icon from './Icon.svelte';

	const dispatch = createEventDispatcher();

	export let type: string = 'text';
	export let value: string = '';
	export let placeholder: string;
	export let name: string;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let label: string;
	export let readonly: boolean = false;
	export let inputRef = null;
	export let min: number | null = null;
	export let max: number | null = null;
	export let marginTop: number = 10;
	export let marginBottom: number = 5;

	interface InputAttributes {
		maxLength?: number;
		minLength?: number;
		max?: number;
		min?: number;
	}

	let realType: string;
	let inputAttributes: InputAttributes;

	let focused: boolean = false;

	const classes: string = `block w-full px-3 py-2 mt-1 text-base text-gray-800 placeholder:gray-500 border border-gray-300 shadow-xs shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
		disabled || readonly ? 'bg-gray-300 dark:bg-gray-500' : ''
	}`;

	const typeWorkaround = (node: HTMLInputElement): void => {
		node.type = type;
	};

	const switchType = (): string => (type = type === 'password' ? 'text' : 'password');

	const handleFocus = (): void => {
		focused = true;
		dispatch('focus');
	};

	const handleBlur = (): void => {
		focused = false;
		dispatch('blur');
	};

	$: realType = type;

	$: inputAttributes = {
		...(min !== null && realType !== 'text' && { min }),
		...(max !== null && realType !== 'text' && { max }),
		...(realType === 'text' && min !== null && { minlength: min }),
		...(realType === 'text' && max !== null && { maxlength: max }),
	};
</script>

<div class={`relative mt-${marginTop} mb-${marginBottom}`}>
	<label
		for={name}
		class="absolute pointer-events-none z-10 transition-all duration-800 ease-in-out font-medium {focused || value ? 'text-primary-500 bottom-11 left-1' : 'text-gray-500 bottom-2.5 left-3'}"
	>
		{label}
		{#if required}
			<span class="text-red-500 font-medium">*</span>
		{/if}
	</label>

	{#if realType !== 'password'}
		<input
			on:focus={handleFocus}
			on:blur={handleBlur}
			use:typeWorkaround
			bind:value
			placeholder={focused || value ? placeholder : ''}
			{name}
			{required}
			{disabled}
			{readonly}
			bind:this={inputRef}
			class={classes}
			{...inputAttributes}
		/>
	{:else if type === 'password'}
		<input
			on:focus={() => (focused = true)}
			on:blur={() => (focused = false)}
			use:typeWorkaround
			bind:value
			placeholder={focused || value ? placeholder : ''}
			{name}
			{required}
			{disabled}
			{readonly}
			class={`${classes} pr-9`}
			{...inputAttributes}
		/>
		<Button additionalStyle="absolute top-2 right-2 cursor-pointer" on:click={switchType}>
			<Icon name="eye" />
		</Button>
	{:else}
		<input
			on:focus={() => (focused = true)}
			on:blur={() => (focused = false)}
			use:typeWorkaround
			bind:value
			placeholder={focused || value ? placeholder : ''}
			{name}
			{required}
			{disabled}
			{readonly}
			class={`${classes} pr-9`}
			{...inputAttributes}
		/>
		<Button additionalStyle="absolute top-2 right-2 cursor-pointer" on:click={switchType}>
			<Icon name="eyeSlash" />
		</Button>
	{/if}
</div>

<style>
	label {
		transition:
			bottom 0.8s ease,
			left 0.8s ease,
			color 0.8s ease;
	}
</style>
