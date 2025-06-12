<script lang="ts">
    import Form from '../shared/Form.svelte';
    import PasswordInput from '../shared/PasswordInput.svelte';
    import Title from '../shared/Title.svelte';
    import { showToast } from '../../services/toastService';
    import { navigate } from '../../stores/locationStore';
    import { t } from 'svelte-i18n';
    import { checkPassword } from '../../services/checkStringService';
    import { profile } from '../../stores/profileStore';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    export let token;

    let password: string = '';
    let confirmPassword: string = '';
    let canSubmit: boolean = false;
    let message: string = '';

    const handleSuccess = (event: CustomEvent): void => {
        showToast($t(event.detail.message));
        if (!$profile) {
            navigate('/login');
        } else {
            navigate('/');
        }
    };

    $: {
        if (password && confirmPassword) {
            message = $t(checkPassword(password, confirmPassword));
            canSubmit = password === confirmPassword && message === '';
        }
    }
</script>

<meta name="robots" content="noindex, nofollow" />
<MetaTags
    title={$t('reset-password.confirm.meta.title')}
    description={$t('reset-password.confirm.meta.description')}
    keywords={$t('reset-password.confirm.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/reset-password/confirm/${token}`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/reset-password/confirm/${token}`,
        },
    ]}
    openGraph={{
        type: 'website',
        title: $t('reset-password.confirm.meta.title'),
        description: $t('reset-password.confirm.meta.description'),
        images: [
          {
            url: `${import.meta.env.VITE_FRONT_URI}/assets/logo-1200x1200.webp`,
            width: 1200,
            height: 1200,
            alt: `open-graph.logo.alt`
          },
        ]
    }}
/>

<Title title={$t('reset-password.confirm.title')} hasBackground />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('reset-password.confirm.title') }]} />

<Form action={`/api/reset-password/confirm/${token}`} method="POST" on:success={handleSuccess} isValid={canSubmit}>
    <PasswordInput name="password" bind:value={password} />
    <PasswordInput name="confirmPassword" label={$t('common.confirm-password.label')} bind:value={confirmPassword} />
</Form>

{#if message}
    <p class="text-red-500 text-sm mt-2">{message}</p>
{/if}
