<script lang="ts">
    import Title from '../shared/Title.svelte';
    import Form from '../shared/Form.svelte';
    import Input from '../shared/Input.svelte';
    import { onMount } from 'svelte';
    import { showToast } from '../../services/toastService';
    import { t } from 'svelte-i18n';
    import { profile } from '../../stores/profileStore';
    import { isValidEmail } from '../../services/checkStringService';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';

    let email: string = '';
    let readonly: boolean = false;
    let isValid: boolean = false;

    onMount(async (): Promise<void> => {
        if ($profile && $profile.email) {
            email = $profile.email;
            readonly = true;
        }
    });

    const handleSuccess = (): void => {
        showToast($t('toast.reset-password.mail.success'));
    };

    const handleFailure = (): void => {
        showToast($t('toast.reset-password.mail.error'), 'error');
    };

    $: isValid = !!email && isValidEmail(email);
</script>

<Title title={$t('reset-password.title')} hasBackground />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('reset-password.title') }]} />

<Form action="/api/reset-password/send-mail" method="POST" on:success={handleSuccess} on:error={handleFailure} bind:isValid>
    <input type="hidden" name="frontUri" value={`${import.meta.env.VITE_FRONT_URI}/reset-password/confirm`} />
    <Input label={$t('common.email.label')} placeholder={$t('common.email.placeholder')} type="email" name="email" bind:value={email} required {readonly} />
</Form>
