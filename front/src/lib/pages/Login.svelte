<script lang="ts">
    import Form from '../shared/Form.svelte';
    import Input from '../shared/Input.svelte';
    import PasswordInput from '../shared/PasswordInput.svelte';
    import { showToast } from '../../services/toastService';
    import axios from 'axios';
    import Title from '../shared/Title.svelte';
    import Link from '../shared/Link.svelte';
    import { navigate } from '../../stores/locationStore';
    import { setProfile } from '../../stores/profileStore';
    import { t } from 'svelte-i18n';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import OauthProviders from '../shared/OauthProviders.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    let email: string = '';
    let password: string = '';
    let canSubmit: boolean = false;

    const handleSuccess = async (event: CustomEvent): Promise<void> => {
        localStorage.setItem('apiToken', event.detail.token.token);
        localStorage.setItem('apiTokenExpiration', event.detail.token.expiresAt);
        axios.defaults.headers.common['Authorization'] = `Bearer ${event.detail.token.token}`;

        setProfile(event.detail.user);

        showToast($t(event.detail.message));
        navigate('/');
    };

    $: canSubmit = !!email && !!password;
</script>

<MetaTags
    title={$t('login.meta.title')}
    description={$t('login.meta.description')}
    keywords={$t('login.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/social/blocked`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/social/blocked`,
        },
    ]}
/>

<Title title={$t('login.title')} hasBackground />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('login.title') }]} />

<Form action="/api/auth" method="post" on:success={handleSuccess} isValid={canSubmit}>
    <OauthProviders />
    <Input type="email" name="email" placeholder={$t('common.email.placeholder')} label={$t('common.email.label')} bind:value={email} />
    <PasswordInput bind:value={password} />
    <div class="w-full mb-3">
        <Link href="/reset-password" className="text-primary-500 hover:text-white duration-300 transition-colors">Forgot password ?</Link>
    </div>
</Form>
