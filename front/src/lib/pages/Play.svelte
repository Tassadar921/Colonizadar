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

	let showJoinModal: boolean = false;
	let showCreateModal: boolean = false;

	let isJoinSubmittable: boolean = false;
	let isCreateSubmittable: boolean = false;

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

	const handleJoinFailure = (event: CustomEvent): void => {
		showToast(event.detail, 'error');
	};

	const handleCreateSuccess = (event: CustomEvent): void => {
		showCreateModal = false;
		showToast($t('toast.room.create.success'));
		navigate(`/play/room/${event.detail.roomId}`);
	};

	const handleCreateFailure = (): void => {
		showToast($t('toast.room.create.error'), 'error');
	};

	$: isJoinSubmittable = !!token && isValidUuid(token);
	$: isCreateSubmittable = !!name && name.length >= 3 && !!(isPrivate ? password && password.length >= 3 : true);
</script>

<Loader bind:isLoading />

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
	<Form action="/api/room/join" method="POST" showBackground={false} bind:isValid={isJoinSubmittable} on:success={handleJoinSuccess} on:error={handleJoinFailure}>
		<Input name="token" label={$t('play.room.join.modal.token.label')} placeholder={$t('play.room.join.modal.token.placeholder')} bind:value={token} required />
		<PasswordInput min={3} bind:value={password} required={false} />
	</Form>
</Modal>

<Modal bind:showModal={showCreateModal}>
	<Subtitle slot="header">{$t('play.room.create.title')}</Subtitle>
	<Form action="/api/room/create" method="POST" showBackground={false} bind:isValid={isCreateSubmittable} on:success={handleCreateSuccess} on:error={handleCreateFailure}>
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
