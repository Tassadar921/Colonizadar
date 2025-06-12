<script lang="ts">
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import BackTo from '../shared/BackTo.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { MetaTags } from 'svelte-meta-tags';
</script>

<meta name="robots" content="noindex, nofollow" />
<MetaTags
    title={$t('already-connected.meta.title')}
    description={$t('already-connected.meta.description')}
    keywords={$t('already-connected.meta.keywords').split(', ')}
    openGraph={{
        type: 'website',
        title: $t('already-connected.meta.title'),
        description: $t('already-connected.meta.description'),
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

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('already-connected.title') }]} />

<div class="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center text-center pointer-events-none">
    <div class="flex flex-col gap-5 pointer-events-auto">
        <Title title={$t('already-connected.title')} />
        <BackTo href="/" text={$t('common.back-to-home')} />
    </div>
</div>
