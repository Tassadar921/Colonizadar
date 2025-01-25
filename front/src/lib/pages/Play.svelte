<script>
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import Form from "../shared/Form.svelte";
    import Breadcrumbs from "../shared/Breadcrumbs.svelte";
</script>

<Title title={$t('play.title')} hasBackground={true} />

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('play.title') }]} hasBackground={true} />

<Form submittable={false}>
    <p>test</p>
</Form>
