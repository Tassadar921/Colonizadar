<script lang="ts">
    import Input from './Input.svelte';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';

    export let value: string = '';
    export let name: string = 'password';
    export let required: boolean = false;
    export let label: string = '';

    let placeholder: string;

    onMount(() => {
        placeholder = $t('common.password.placeholder');
        if (!label) {
            label = $t('common.password.label');
        }
    });
</script>

<Input bind:value type="password" {name} {placeholder} {label} {required} />
