<script lang="ts">
    import { formatGameNumbers } from '../../services/stringService';

    export let min: number = 0;
    export let max: number = 100;
    export let step: number = 1;
    export let value: number = min;
    export let name: string;

    const id: string = `range-${Math.random().toString(36).slice(2, 9)}`;

    function handleInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        value = +target.value;
    }
</script>

<div class="w-full">
    <label for={id} class="text-gray-700 dark:text-white font-medium mb-1">
        Value: <span class="text-primary-500 font-medium">{formatGameNumbers(value)}</span>
    </label>
    <input {name} {id} type="range" {min} {max} {step} bind:value on:input={handleInput} class="custom-range w-full h-2 bg-gray-200 rounded-lg appearance-none" />
</div>

<style>
    .custom-range::-webkit-slider-thumb {
        appearance: none;
        width: 1rem;
        height: 1rem;
        background-color: #f97316;
        border-radius: 9999px;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        margin-top: -6px;
        transition: background-color 0.2s ease;
    }

    .custom-range::-webkit-slider-runnable-track {
        background-color: #e5e7eb;
        height: 0.5rem;
        border-radius: 0.25rem;
    }

    /* Firefox */
    .custom-range::-moz-range-thumb {
        width: 1rem;
        height: 1rem;
        background-color: #f97316;
        border: none;
        border-radius: 9999px;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        transition: background-color 0.2s ease;
    }

    .custom-range::-moz-range-track {
        background-color: #e5e7eb;
        height: 0.5rem;
        border-radius: 0.25rem;
    }

    .custom-range:focus::-webkit-slider-thumb {
        outline: none;
        box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.4);
    }

    .custom-range:focus::-moz-range-thumb {
        outline: none;
        box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.4);
    }
</style>
