<script>
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import Form from '../shared/Form.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import Button from '../shared/Button.svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import Input from '../shared/Input.svelte';
    import { isValidUuid } from '../../services/checkStringService.js';

    let showJoinModal = false;
    let isJoinSubmittable = false;
    let token;

    $: isJoinSubmittable = token && isValidUuid(token);
</script>

<Title title={$t('play.title')} hasBackground={true} />

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('play.title') }]} hasBackground={true} />

<Form submittable={false}>
    <div class="flex flex-col gap-3 p-3">
        <Button customStyle={true} className="transition-all duration-300 hover:scale-105 transform bg-green-700 hover:bg-green-600 hover: px-3 py-2 rounded-xl">
            <span class="text-white text-xl font-bold">{$t('play.create.title')}</span>
        </Button>
        <Button
            customStyle={true}
            on:click={() => (showJoinModal = true)}
            className="transition-all duration-300 hover:scale-105 transform bg-primary-800 hover:bg-primary-700 hover: px-3 py-2 rounded-xl"
        >
            <span class="text-white text-xl font-bold">{$t('play.join.title')}</span>
        </Button>
    </div>
</Form>

<Modal bind:showModal={showJoinModal}>
    <Subtitle slot="header">{$t('play.join.title')}</Subtitle>
    <Form showBackground={false} bind:isValid={isJoinSubmittable}>
        <Input name="token" label={$t('play.join.modal.token.label')} placeholder={$t('play.join.modal.token.placeholder')} bind:value={token} />
    </Form>
</Modal>
