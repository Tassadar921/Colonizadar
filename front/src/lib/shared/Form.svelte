<script lang="ts">
    import axios from 'axios';
    import Icon from './Icon.svelte';
    import { t } from 'svelte-i18n';
    import { createEventDispatcher, tick } from 'svelte';
    import FormBackground from './background/FormBackground.svelte';
    import { language } from '../../stores/languageStore';
    import { showToast } from '../../services/toastService';

    const dispatch = createEventDispatcher();

    export let method: 'GET' | 'POST' | 'get' | 'post' | 'PUT' | 'put' | 'PATCH' | 'patch' | undefined = 'GET';
    export let action: string = '';
    export let isValid: boolean = false;
    export let submittable: boolean = true;
    export let hasBackground: boolean = true;
    export let isFormVisible: boolean = true;

    let isLoading: boolean = false;
    let isSendButtonDisabled: boolean = false;
    let buttonElement: HTMLButtonElement;

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        isLoading = true;
        const form: HTMLFormElement = <HTMLFormElement>event.target;
        const formData: FormData = new FormData(form);

        const formDataObj: { [key: string]: any } = {};

        formData.forEach((value: any, key: string) => {
            formDataObj[key] = value;
        });

        try {
            const { data } = await axios({
                method,
                url: `${axios.defaults.baseURL}${action}`,
                data: method === 'GET' ? null : formData,
                params: method === 'GET' ? formDataObj : null,
                headers: method !== 'GET' ? { 'Content-Type': 'multipart/form-data', 'Accept-Language': `${$language}-${$language.toUpperCase()}` || 'en-US' } : {},
            });
            dispatch('success', data);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
            dispatch('error');
        }
        isLoading = false;
    };

    $: if (isFormVisible && buttonElement) {
        tick().then(() => {
            const { width, height } = buttonElement.getBoundingClientRect();
            if (width && height) {
                buttonElement.style.setProperty('width', `${width}px`);
                buttonElement.style.setProperty('height', `${height}px`);
            }
        });
    }
    $: isSendButtonDisabled = isLoading || !isValid;
</script>

{#if hasBackground}
    <FormBackground />
{/if}

<form
    {action}
    on:submit={handleSubmit}
    {method}
    class="relative z-10 bg-gray-300 dark:bg-gray-700 rounded-2xl p-2 md:p-6 m-auto {hasBackground ? 'mt-20' : ''}"
    style={hasBackground ? 'max-width: 500px' : ''}
>
    <slot />
    {#if submittable}
        <div class="w-full flex justify-between mt-4">
            <div>
                <slot name="other-option" />
            </div>
            <button
                bind:this={buttonElement}
                type="submit"
                disabled={isSendButtonDisabled}
                aria-label="Submit form"
                class="bg-green-700 {isSendButtonDisabled ? '' : 'hover:bg-green-800'} transition-all duration-300 px-5 py-1.5 rounded-xl text-2xl font-bold flex justify-center items-center gap-3"
            >
                {#if isLoading}
                    <Icon name="spinner" size={40} />
                {:else}
                    <p class="text-white">{$t('common.submit')}</p>
                    <span class="text-primary-500">
                        <Icon name="send" />
                    </span>
                {/if}
            </button>
        </div>
    {/if}
</form>
