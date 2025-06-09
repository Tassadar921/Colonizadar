<script lang="ts">
    import { t } from 'svelte-i18n';
    import { MetaTags } from 'svelte-meta-tags';
</script>

<meta name="robots" content="noindex, nofollow" />
<MetaTags title={$t('not-found.meta.title')} description={$t('not-found.meta.description')} keywords={$t('not-found.meta.keywords').split(', ')} />

<div class="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center text-center pointer-events-none">
    <div class="flex flex-col gap-5 pointer-events-auto">
        <h1>{$t('not-found.title')}</h1>
        <a href="/">{$t('common.back-to-home')}</a>
    </div>
</div>
