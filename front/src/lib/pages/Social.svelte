<script lang="ts">
    import Card from '../shared/Card.svelte';
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    interface Page {
        title: string;
        icon: string;
        href: string;
        description: string;
    }

    let pages: Page[] = [];

    $: pages = [
        {
            title: $t('social.friends.title'),
            icon: 'people',
            href: '/social/friends',
            description: $t('social.friends.description'),
        },
        {
            title: $t('social.blocked.title'),
            icon: 'stop',
            href: '/social/blocked',
            description: $t('social.blocked.description'),
        },
        {
            title: $t('profile.title'),
            icon: 'user',
            href: '/profile',
            description: $t('profile.description'),
        },
    ];
</script>

<MetaTags
    title={$t('social.meta.title')}
    description={$t('social.meta.description')}
    keywords={$t('social.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/social`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/social`,
        },
    ]}
    openGraph={{
        type: 'website',
        title: $t('social.meta.title'),
        description: $t('social.meta.description'),
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

<Title title={$t('social.title')} />

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title') }]} />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
    {#each pages as page}
        <Card title={page.title} icon={page.icon} href={page.href} description={page.description} />
    {/each}
</div>
