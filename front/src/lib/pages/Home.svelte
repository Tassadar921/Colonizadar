<script lang="ts">
    import Card from '../shared/Card.svelte';
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import { MetaTags } from 'svelte-meta-tags';
    import { location } from '../../stores/locationStore';
    import { language } from '../../stores/languageStore';

    interface Page {
        title: string;
        icon: string;
        href: string;
        description: string;
    }

    let pages: Page[] = [];

    $: pages = [
        {
            title: $t('play.title'),
            icon: 'game',
            href: '/play',
            description: $t('play.description'),
        },
        {
            title: $t('social.title'),
            icon: 'people',
            href: '/social',
            description: $t('social.description'),
        },
    ];
</script>

<MetaTags
    title={$t('home.meta.title')}
    description={$t('home.meta.description')}
    keywords={$t('home.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr`,
        },
    ]}
    openGraph={{
        type: 'website',
        title: $t('home.meta.title'),
        description: $t('home.meta.description'),
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

<Title title={$t('home.title')} />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
    {#each pages as page}
        <Card title={page.title} icon={page.icon} href={page.href} description={page.description} />
    {/each}
</div>
