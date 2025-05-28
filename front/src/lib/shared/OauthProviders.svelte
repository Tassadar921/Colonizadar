<script lang="ts">
    import Icon from './Icon.svelte';
    import { showToast } from '../../services/toastService';

    const handleOauthClick = async (provider: 'google' | 'github' | 'discord'): Promise<void> => {
        try {
            window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/${provider}`;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };
</script>

<div class="flex justify-around">
    <button type="button" on:click={() => handleOauthClick('google')} class="rounded-full p-3">
        <Icon name="google" size={42} />
    </button>
    <button type="button" on:click={() => handleOauthClick('github')} class="rounded-full">
        <Icon name="github" size={42} />
    </button>
    <button type="button" on:click={() => handleOauthClick('discord')} class="rounded-full">
        <Icon name="discord" size={42} />
    </button>
</div>
