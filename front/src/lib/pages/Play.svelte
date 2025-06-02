<script lang="ts">
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import Form from '../shared/Form.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import Button from '../shared/Button.svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import Input from '../shared/Input.svelte';
    import { isValidUuid } from '../../services/checkStringService';
    import Loader from '../shared/Loader.svelte';
    import Switch from '../shared/Switch.svelte';
    import PasswordInput from '../shared/PasswordInput.svelte';
    import { showToast } from '../../services/toastService';
    import { navigate } from '../../stores/locationStore';
    import { MetaTags } from 'svelte-meta-tags';

    let showJoinModal: boolean = false;
    let showCreateModal: boolean = false;

    let canSubmitJoin: boolean = false;
    let canSubmitCreate: boolean = false;

    let token: string;
    let name: string;
    let isPrivate: boolean = false;
    let password: string;

    let isLoading: boolean = false;

    const handleJoinSuccess = (event: CustomEvent): void => {
        showJoinModal = false;
        showToast(event.detail.message);
        navigate(`/play/room/${event.detail.roomId}`);
    };

    const handleCreateSuccess = (event: CustomEvent): void => {
        showCreateModal = false;
        showToast(event.detail.message);
        navigate(`/play/room/${event.detail.roomId}`);
    };

    $: canSubmitJoin = !!token && isValidUuid(token);
    $: canSubmitCreate = !!name && name.length >= 3 && !!(isPrivate ? password && password.length >= 3 : true);
</script>

<MetaTags
    title={$t('play.meta.title')}
    description={$t('play.meta.description')}
    keywords={$t('play.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/play`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/play`,
        },
    ]}
/>

<Loader {isLoading} />

<Title title={$t('play.title')} hasBackground />

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('play.title') }]} hasBackground />

<Form submittable={false}>
    <div class="flex flex-col gap-3 p-3">
        <Button on:click={() => (showCreateModal = true)} customStyle className="transition-all duration-300 hover:scale-105 transform bg-green-700 hover:bg-green-600 hover: px-3 py-2 rounded-xl">
            <span class="text-white text-xl font-bold">{$t('play.room.create.title')}</span>
        </Button>
        <Button customStyle on:click={() => (showJoinModal = true)} className="transition-all duration-300 hover:scale-105 transform bg-primary-800 hover:bg-primary-700 hover: px-3 py-2 rounded-xl">
            <span class="text-white text-xl font-bold">{$t('play.room.join.title')}</span>
        </Button>
    </div>
</Form>

<Modal bind:showModal={showJoinModal}>
    <Subtitle slot="header">{$t('play.room.join.title')}</Subtitle>
    <Form action="/api/room/join" method="POST" hasBackground={false} isValid={canSubmitJoin} isFormVisible={showJoinModal} on:success={handleJoinSuccess}>
        <Input name="token" label={$t('play.room.join.modal.token.label')} placeholder={$t('play.room.join.modal.token.placeholder')} bind:value={token} required />
        <PasswordInput min={3} bind:value={password} required={false} />
    </Form>
</Modal>

<Modal bind:showModal={showCreateModal}>
    <Subtitle slot="header">{$t('play.room.create.title')}</Subtitle>
    <Form action="/api/room/create" method="POST" hasBackground={false} isValid={canSubmitCreate} isFormVisible={showCreateModal} on:success={handleCreateSuccess}>
        <Input name="name" label={$t('play.room.create.modal.name.label')} placeholder={$t('play.room.create.modal.name.placeholder')} bind:value={name} min={3} required />
        <div class="flex flex-col">
            <div class="flex items-center mt-10 mb-5">
                <Switch size={4} bind:value={isPrivate} label={$t('common.private')} />
            </div>
            {#if isPrivate}
                <PasswordInput min={3} bind:value={password} marginTop={5} marginBottom={0} />
            {/if}
        </div>
    </Form>
</Modal>
