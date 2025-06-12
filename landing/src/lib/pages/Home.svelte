<script lang="ts">
    import { t } from 'svelte-i18n';
    import { MetaTags } from 'svelte-meta-tags';
    import { Button } from '$lib/components/ui/button/index.js';

    const handleClick = () => {
        console.log('clicked');
    };
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
            alt: `open-graph.logo.alt`
          },
        ]
    }}
/>

<h1>{$t('home.title')}</h1>

<Button onclick={handleClick}>Test</Button>
