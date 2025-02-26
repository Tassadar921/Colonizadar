<script>
    import Icon from './Icon.svelte';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { raw } from '../../services/stringService.js';
    import Loader from './Loader.svelte';

    export let name = '';
    export let description = '';
    export let title = null;
    export let width = '96';
    export let accept = '';
    export let fileName = '';
    export let file = null;
    export let pathPrefix;
    export let id;
    export let disabled = false;

    let acceptedFormats = '';
    let isDragging = false;
    let previewSrc = `${process.env.VITE_API_BASE_URL}/api/static/${pathPrefix}/${id}?token=${localStorage.getItem('apiToken')}`;
    let inputRef;
    let loading = false;

    onMount(() => {
        title = title ?? $t('common.file.description');
        description = description ?? $t('common.file.description');
        acceptedFormats = accept
            .split(' ')
            .map((format) => `.${format}`)
            .join(',');
    });

    const processFiles = (files) => {
        if (disabled) {
            return;
        }
        if (files.length > 0) {
            loading = true;
            file = files[0];
            fileName = file.name;

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewSrc = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                previewSrc = '';
            }
            loading = false;
        } else {
            file = null;
            fileName = '';
            previewSrc = '';
        }
    };

    const handleFileChange = (event) => {
        if (!disabled) processFiles(event.target.files);
    };

    const handleDragOver = (event) => {
        if (!disabled) {
            event.preventDefault();
            isDragging = true;
        }
    };

    const handleDragLeave = () => {
        if (!disabled) {
            isDragging = false;
        }
    };

    const handleDrop = (event) => {
        if (!disabled) {
            event.preventDefault();
            isDragging = false;
            processFiles(event.dataTransfer.files);
        }
    };

    const handleKeyDown = (event) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            inputRef.click();
        }
    };
</script>

<Loader bind:loading />

<div class="flex flex-col w-full my-5">
    {#if title}
        <h3 class="font-semibold text-center mb-2">{title}</h3>
    {/if}
    <button
        type="button"
        class={`w-${width} flex flex-col items-center justify-center border-2 border-gray-400 dark:border-white rounded-lg cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 m-auto p-3`}
        class:bg-blue-50={isDragging && !disabled}
        class:border-blue-500={isDragging && !disabled}
        class:opacity-50={disabled}
        class:cursor-not-allowed={disabled}
        on:click={() => !disabled && inputRef.click()}
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
        on:keydown={handleKeyDown}
        aria-label="File uploader"
        {disabled}
    >
        <input bind:this={inputRef} type="file" class="hidden" {name} accept={acceptedFormats} on:change={handleFileChange} {disabled} />
        <span class="text-primary-500">
            <Icon name="upload" size="35" />
        </span>
        <span class="text-center text-sm text-gray-500 my-3">
            {#if fileName}
                {#if previewSrc}
                    <div class="mt-3 flex justify-center">
                        <img src={previewSrc} alt="Preview" class="w-24 h-24 object-cover rounded" />
                    </div>
                {:else}
                    {fileName}
                {/if}
            {:else}
                {@html raw(description)}
            {/if}
        </span>
    </button>
</div>
