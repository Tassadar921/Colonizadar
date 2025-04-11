<script lang="ts">
    import Modal from './Modal.svelte';
    import { t } from 'svelte-i18n';

    export let showModal: boolean;
    export let closable: boolean = true;
    export let fullWidth: boolean = false;
    export let successText: string = $t('common.yes');
</script>

<Modal bind:showModal {successText} closeText={$t('common.no')} {closable} confirm {fullWidth} on:success on:close>
    <slot name="header" slot="header" />
    <slot />
</Modal>
