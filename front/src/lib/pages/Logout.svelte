<script lang="ts">
    import { showToast } from '../../services/toastService';
    import { navigate } from '../../stores/locationStore';
    import { clearProfile } from '../../stores/profileStore';
    import Subtitle from '../shared/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import ConfirmModal from '../shared/ConfirmModal.svelte';
    import axios from 'axios';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { location } from '../../stores/locationStore';
    import { language } from '../../stores/languageStore';

    let showModal: boolean = true;

    const handleSuccess = async (): Promise<void> => {
        try {
            const { data } = await axios.get('/api/logout');
            localStorage.removeItem('apiToken');
            localStorage.removeItem('apiTokenExpiration');
            localStorage.removeItem('subscribed');
            clearProfile();
            showToast(data.message);
            navigate('/login');
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
            navigate('/');
        }
    };

    const handleClose = (): void => {
        navigate('/');
    };
</script>

<MetaTags
    title={$t('logout.meta.title')}
    description={$t('logout.meta.description')}
    keywords={$t('logout.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/logout`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/logout`,
        },
    ]}
    openGraph={{
        type: 'website',
        title: $t('logout.meta.title'),
        description: $t('logout.meta.description'),
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

<Title title={$t('logout.title')} />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('logout.title') }]} />

<ConfirmModal bind:showModal on:success={handleSuccess} on:close={handleClose}>
    <Subtitle slot="header">{$t('logout.modal.title')}</Subtitle>
    <p>{$t('logout.modal.text')}</p>
</ConfirmModal>
