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
    import { MetaTags } from 'svelte-meta-tags';

    let email: string = '';
    let readonly: boolean = false;
    let canSubmit: boolean = false;

    onMount(async (): Promise<void> => {
        if ($profile && $profile.email) {
            email = $profile.email;
            readonly = true;
        }
    });

    const handleSuccess = (event: CustomEvent): void => {
        showToast(event.detail.message);
    };

    $: canSubmit = !!email && isValidEmail(email);
</script>

<MetaTags
    title={$t('reset-password.meta.title')}
    description={$t('reset-password.meta.description')}
    keywords={$t('reset-password.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/reset-password`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/reset-password`,
        },
    ]}
    openGraph={{
        type: 'website',
        title: $t('reset-password.meta.title'),
        description: $t('reset-password.meta.description'),
        images: [
            {
                url: `${import.meta.env.VITE_FRONT_URI}/assets/logo-1200x1200.webp`,
                width: 1200,
                height: 1200,
                alt: `open-graph.logo.alt`,
            },
        ],
    }}
/>

<Title title={$t('reset-password.title')} hasBackground />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('reset-password.title') }]} />

<Form action="/api/reset-password/send-mail" method="POST" on:success={handleSuccess} isValid={canSubmit}>
    <Input label={$t('common.email.label')} placeholder={$t('common.email.placeholder')} type="email" name="email" bind:value={email} required {readonly} />
</Form>
