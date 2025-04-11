<script lang="ts">
    export let type: "button" | "reset" | "submit" | null | undefined = 'button';
    export let disabled: boolean = false;
    export let idName: string = '';
    export let className: string = '';
    export let additionalStyle: string = '';
    export let customStyle: boolean = false;
    export let ariaLabel: string = 'This is a button';
    export let style: string = '';
</script>

<button
    {disabled}
    id={idName}
    {type}
    aria-label={ariaLabel}
    on:click
    on:mouseover
    on:focus
    on:blur
    on:mouseout
    {style}
    class="{customStyle
        ? className
        : `rounded ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 dark:text-primary-500 hover:text-gray-700 hover:dark:text-primary-400 cursor-pointer'} transition-colors duration-300`} {additionalStyle}"
>
    <slot />
</button>
