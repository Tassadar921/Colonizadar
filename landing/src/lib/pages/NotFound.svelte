<script lang="ts">
    import { t } from 'svelte-i18n';
    import { MetaTags } from 'svelte-meta-tags';
    import Title from '../shared/Title.svelte';
    import { ArrowLeft } from '@lucide/svelte';
    import { Button } from '$lib/components/ui/button';
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
            alt: `open-graph.logo.alt`
          },
        ]
    }}
/>

<div class="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center text-center pointer-events-none">
    <div class="flex flex-col gap-5 pointer-events-auto">
        <Title title={$t('not-found.title')} />
        <Button variant="link" class="flex flex-row gap-1 items-center"><ArrowLeft />{$t('common.back-to-home')}</Button>
    </div>
</div>
