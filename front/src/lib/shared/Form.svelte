<script lang="ts">
    import axios from 'axios';
    import Button from './Button.svelte';
    import Loader from './Loader.svelte';
    import Icon from './Icon.svelte';
    import { t } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';
    import FormBackground from './background/FormBackground.svelte';
    import { language } from '../../stores/languageStore';
    import Send from '../icons/Send.svelte';

    const dispatch = createEventDispatcher();

    export let method: 'GET' | 'POST' | 'get' | 'post' | undefined = 'GET';
    export let action: string = '';
    export let isValid: boolean = false;
    export let submittable: boolean = true;
    export let showBackground: boolean = true;

    let loading: boolean = false;
    let isSendButtonDisabled: boolean = false;

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        loading = true;
        const form: HTMLFormElement = <HTMLFormElement>event.target;
        const formData: FormData = new FormData(form);

        const formDataObj: { [key: string]: any } = {};

        formData.forEach((value: any, key: string) => {
            formDataObj[key] = value;
        });

        try {
            const response = await axios({
                method,
                url: `${axios.defaults.baseURL}${action}`,
                data: method === 'GET' ? null : formData,
                params: method === 'GET' ? formDataObj : null,
                headers: method !== 'GET' ? { 'Content-Type': 'multipart/form-data', 'Accept-Language': `${$language}-${$language.toUpperCase()}` || 'en-US' } : {},
            });
            loading = false;
            dispatch('success', response.data);
        } catch (error: any) {
            console.log(error.message);
            loading = false;
            dispatch('error', error.message);
        }
    };

    $: isSendButtonDisabled = !isValid;
</script>

{#if showBackground}
    <FormBackground />
{/if}

<form
    {action}
    on:submit={handleSubmit}
    {method}
    class="relative z-10 bg-gray-200 dark:bg-gray-700 rounded-2xl p-2 md:p-6 m-auto {showBackground ? 'mt-20' : ''}"
    style={showBackground ? 'max-width: 500px' : ''}
>
    <slot />
    {#if submittable}
        <div class="w-full flex justify-between mt-4">
            <div>
                <slot name="other-option" />
            </div>
            <Button
                type="submit"
                bind:disabled={isSendButtonDisabled}
                customStyle
                additionalStyle="bg-green-700 {isSendButtonDisabled ? 'cursor-not-allowed' : 'hover:bg-green-800'} transition-all duration-300 py-2 px-4 rounded-xl text-2xl font-bold"
            >
                <div class="flex flex-row items-center gap-3">
                    <p class="text-white">{$t('common.submit')}</p>
                    <div class="text-primary-500">
                        <Send />
                    </div>
                </div>
            </Button>
        </div>
    {/if}
    <Loader bind:loading />
</form>
