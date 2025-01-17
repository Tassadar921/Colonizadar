<script>
    import Title from '../shared/Title.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import BackTo from '../shared/BackTo.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
</script>

<Title title={$t('notifications.title')} />

<Breadcrumbs hasBackground={true} items={[{ label: $t('home.title'), path: '/' }, { label: $t('notifications.title') }]} />
