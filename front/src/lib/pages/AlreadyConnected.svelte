<script lang="ts">
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import BackTo from '../shared/BackTo.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
</script>

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('already-connected.title') }]} />

<div class="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center text-center pointer-events-none">
    <div class="flex flex-col gap-5 pointer-events-auto">
        <Title title={$t('already-connected.title')} />
        <BackTo href="/" text={$t('common.back-to-home')} />
    </div>
</div>
