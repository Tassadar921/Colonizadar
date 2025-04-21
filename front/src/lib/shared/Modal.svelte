<script lang="ts">
	import Button from './Button.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { t } from 'svelte-i18n';

	const dispatch = createEventDispatcher();

	export let showModal: boolean = false;
	export let closeText: string | null = null;
	export let successText: string = '';
	export let fullWidth: boolean = false;
	export let confirm: boolean = false;
	export let closable: boolean = true;

	let initialFullWidth: boolean = fullWidth;
	let dialog: HTMLDialogElement;

	const handleSuccess = (): void => {
		dispatch('success');
	};

	const handleClose = (): void => {
		if (closable) {
			dispatch('close');
			dialog.close();
		}
	};

	onMount((): void => {
		if (!initialFullWidth) {
			window.addEventListener('resize', () => {
				fullWidth = window.innerWidth < 768;
			});
		}
	});

	$: if (dialog) {
		if (showModal) {
			dialog.showModal();
			dispatch('open');
		} else {
			dialog.close();
		}
	}
</script>

<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	style={`width: ${fullWidth ? '90%' : '50%'}`}
	class="rounded-lg border-none p-0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
>
	{#if closable}
		<Button type="button" ariaLabel={$t('common.close-modal')} className="fixed inset-0 w-full h-full cursor-default" customStyle on:click={handleClose} />
	{/if}

	<div class="p-4 bg-white dark:bg-gray-700 rounded-lg relative">
		<slot name="header" />
		<hr class="my-2" />
		<slot />
		<hr class="my-2" />
		<div class="flex flex-row justify-center">
			{#if successText}
				<div class="flex flex-row justify-center space-x-12 w-full">
					{#if !confirm && closable}
						<Button on:click={handleClose} ariaLabel={closeText || $t('common.no')}>
							{closeText || $t('common.no')}
						</Button>
					{/if}
					<Button on:click={handleSuccess} ariaLabel={successText || $t('common.yes')}>
						{successText || $t('common.yes')}
					</Button>
					{#if confirm && closable}
						<Button on:click={handleClose} ariaLabel={closeText || $t('common.no')}>
							{closeText || $t('common.no')}
						</Button>
					{/if}
				</div>
			{:else}
				<Button className="mx-auto" on:click={handleClose} ariaLabel={$t('common.close')}>
					{closeText || $t('common.close')}
				</Button>
			{/if}
		</div>
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
