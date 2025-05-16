<script lang="ts">
	import { t } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { raw } from '../../services/stringService';
	import Loader from './Loader.svelte';
	import Icon from './Icon.svelte';

	export let name: string = '';
	export let description: string = '';
	export let title: string = '';
	export let width: string = '96';
	export let accept: string = '';
	export let fileName: string = '';
	export let file: File | null = null;
	export let pathPrefix: string;
	export let id: number;
	export let disabled: boolean = false;

	let acceptedFormats: string = '';
	let isDragging: boolean = false;
	let previewSrc: string = `${import.meta.env.VITE_API_BASE_URL}/api/static/${pathPrefix}/${id}?token=${localStorage.getItem('apiToken')}`;
	let inputRef: HTMLInputElement;
	let isLoading: boolean = false;

	onMount((): void => {
		title = title ?? $t('common.file.description');
		description = description ?? $t('common.file.description');
		acceptedFormats = accept
			.split(' ')
			.map((format) => `.${format}`)
			.join(',');
	});

	const processFiles = (files: FileList): void => {
		if (disabled) {
			return;
		}
		if (files.length > 0) {
			isLoading = true;
			file = files[0];
			fileName = file.name;

			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e: ProgressEvent<FileReader>) => {
					previewSrc = e.target?.result as string;
				};
				reader.readAsDataURL(file);
			} else {
				previewSrc = '';
			}
			isLoading = false;
		} else {
			file = null;
			fileName = '';
			previewSrc = '';
		}
	};

	const handleFileChange = (event: Event): void => {
		const target = event.target as HTMLInputElement;
		if (!disabled && target.files) {
			processFiles(target.files);
		}
	};

	const handleDragOver = (event: DragEvent): void => {
		if (!disabled) {
			event.preventDefault();
			isDragging = true;
		}
	};

	const handleDragLeave = (): void => {
		if (!disabled) {
			isDragging = false;
		}
	};

	const handleDrop = (event: DragEvent): void => {
		if (!disabled) {
			event.preventDefault();
			isDragging = false;
			if (event.dataTransfer?.files) {
				processFiles(event.dataTransfer.files);
			}
		}
	};

	const handleKeyDown = (event: KeyboardEvent): void => {
		if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
			inputRef.click();
		}
	};
</script>

<Loader bind:isLoading />

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
			<Icon name="upload" size={35} />
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
