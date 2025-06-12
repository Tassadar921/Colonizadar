<script lang="ts">
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import BackTo from '../shared/BackTo.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { location } from '../../stores/locationStore';
    import { language } from '../../stores/languageStore';
</script>

<meta name="robots" content="noindex, nofollow" />
<MetaTags
    title={$t('not-found.meta.title')}
    description={$t('not-found.meta.description')}
    keywords={$t('not-found.meta.keywords').split(', ')}
    openGraph={{
        type: 'website',
        title: $t('not-found.meta.title'),
        description: $t('not-found.meta.description'),
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

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('not-found.title') }]} />

<div class="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center text-center pointer-events-none">
    <div class="flex flex-col gap-5 pointer-events-auto">
        <Title title={$t('not-found.title')} />
        <BackTo href="/" text={$t('common.back-to-home')} />
    </div>
</div>
