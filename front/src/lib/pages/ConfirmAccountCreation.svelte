<script lang="ts">
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import { navigate } from '../../stores/locationStore';
    import { setProfile } from '../../stores/profileStore';
    import { MetaTags } from 'svelte-meta-tags';
    import { location } from '../../stores/locationStore';
    import { language } from '../../stores/languageStore';

    export let token;

    onMount(async () => {
        try {
            const { data } = await axios.get(`/api/account-creation/confirm/${token}`);
            localStorage.setItem('apiToken', data.token.token);
            localStorage.setItem('apiTokenExpiration', data.token.expiresAt);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token.token}`;

            setProfile(data.user);
            showToast(data.message);
            navigate('/');
        } catch (error: any) {
            showToast(error.response.data.message, 'error');
        }
    });
</script>

<meta name="robots" content="noindex, nofollow" />
<MetaTags
    title={$t('create-account.confirm.meta.title')}
    description={$t('create-account.confirm.meta.description')}
    keywords={$t('create-account.confirm.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/create-account/confirm/${token}`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/create-account/confirm/${token}`,
        },
    ]}
    openGraph={{
        type: 'website',
        title: $t('create-account.confirm.meta.title'),
        description: $t('create-account.confirm.meta.description'),
        images: [
            {
                url: `${import.meta.env.VITE_FRONT_URI}/assets/logo-1200x1200.webp`,
                width: 1200,
                height: 1200,
                alt: `open-graph.logo.alt`,
            },
        ],
        url: `${import.meta.env.VITE_FRONT_URI}${$location}`,
        locale: $language,
        siteName: 'Colonizadar',
    }}
/>

<Title title={$t('create-account.confirm.title')} hasBackground={true} />
