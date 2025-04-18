<script lang="ts">
	import Icon from './Icon.svelte';

	export let disabled: boolean = false;
	export let icon: string = '';
	export let size: number = 24;
	export let idName: string = '';
	export let additionalClasses: string = '';
</script>

<button
	id={idName}
	class={`${additionalClasses} ${disabled ? 'dark:text-gray-400 hover:cursor-not-allowed' : 'text-primary-500 hover:text-black hover:dark:text-primary-200 transition-colors duration-300'}`}
	on:click
	{disabled}
>
	<Icon bind:name={icon} {size} />
</button>
