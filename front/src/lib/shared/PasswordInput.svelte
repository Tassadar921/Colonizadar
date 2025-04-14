<script lang="ts">
    import Input from './Input.svelte';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';

    export let value: string = '';
    export let name: string = 'password';
    export let required: boolean = false;
    export let label: string = '';
    export let min: number | null = null;
    export let marginTop: number = 10;
    export let marginBottom: number = 5;

    let placeholder: string;

    onMount(() => {
        placeholder = $t('common.password.placeholder');
        if (!label) {
            label = $t('common.password.label');
        }

        console.log(min);
    });
</script>

<Input bind:value type="password" {name} {placeholder} {label} {min} {marginBottom} {marginTop} {required} />
