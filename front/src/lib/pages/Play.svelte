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
    import Loader from '../shared/Loader.svelte';
    import Switch from '../shared/Switch.svelte';
    import PasswordInput from '../shared/PasswordInput.svelte';
    import { showToast } from '../../services/toastService.js';
    import { navigate } from '../../stores/locationStore.ts';

    let showJoinModal = false;
    let showCreateModal = false;

    let isJoinSubmittable = false;
    let isCreateSubmittable = false;

    let token;
    let name;
    let isPrivate = false;
    let password;

    let loading = false;

    const handleJoinSuccess = (event) => {
        showJoinModal = false;
        showToast(event.detail.message);
        navigate(`/play/room/${event.detail.roomId}`);
    };

    const handleJoinFailure = (event) => {
        showToast(event.detail, 'error');
    };

    const handleCreateSuccess = (event) => {
        showCreateModal = false;
        showToast($t('toast.room.create.success'));
        navigate(`/play/room/${event.detail.roomId}`);
    };

    const handleCreateFailure = () => {
        showToast($t('toast.room.create.error'), 'error');
    };

    $: isJoinSubmittable = token && isValidUuid(token);
    $: isCreateSubmittable = name && (isPrivate ? password : true);
</script>

<Loader bind:loading />

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

<Modal bind:showModal={showJoinModal} fullWidth>
    <Subtitle slot="header">{$t('play.room.join.title')}</Subtitle>
    <Form action="/api/room/join" method="POST" showBackground={false} bind:isValid={isJoinSubmittable} on:success={handleJoinSuccess} on:error={handleJoinFailure}>
        <Input name="token" label={$t('play.room.join.modal.token.label')} placeholder={$t('play.room.join.modal.token.placeholder')} bind:value={token} required />
    </Form>
</Modal>

<Modal bind:showModal={showCreateModal} fullWidth>
    <Subtitle slot="header">{$t('play.room.create.title')}</Subtitle>
    <Form action="/api/room/create" method="POST" showBackground={false} bind:isValid={isCreateSubmittable} on:success={handleCreateSuccess} on:error={handleCreateFailure}>
        <Input name="name" label={$t('play.room.create.modal.name.label')} placeholder={$t('play.room.create.modal.name.placeholder')} bind:value={name} required />
        <div class="grid grid-cols-1 md:grid-cols-2">
            <div class="flex items-center mt-10 mb-5">
                <Switch size={4} bind:value={isPrivate} label={$t('common.private')} />
            </div>
            {#if isPrivate}
                <PasswordInput bind:value={password} />
            {/if}
        </div>
    </Form>
</Modal>
