<script lang="ts">
	import Form from '../shared/Form.svelte';
	import PasswordInput from '../shared/PasswordInput.svelte';
	import Title from '../shared/Title.svelte';
	import { showToast } from '../../services/toastService';
	import { navigate } from '../../stores/locationStore';
	import { t } from 'svelte-i18n';
	import { checkPassword } from '../../services/checkStringService';
	import { profile } from '../../stores/profileStore';
	import Breadcrumbs from '../shared/Breadcrumbs.svelte';

	export let token = '';

	let password: string = '';
	let confirmPassword: string = '';
	let canSubmit: boolean = false;
	let message: string = '';

	const handleSuccess = (): void => {
		showToast($t('toast.reset-password.confirm.success'));
		if (!$profile) {
			navigate('/login');
		} else {
			navigate('/');
		}
	};

	$: {
		if (password && confirmPassword) {
			message = $t(checkPassword(password, confirmPassword));
			canSubmit = password === confirmPassword && message === '';
		}
	}
</script>

<Title title={$t('reset-password.confirm.title')} hasBackground />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('reset-password.confirm.title') }]} />

<Form action={`/api/reset-password/confirm/${token}`} method="POST" on:success={handleSuccess} bind:isValid={canSubmit}>
	<PasswordInput name="password" bind:value={password} />
	<PasswordInput name="confirmPassword" label={$t('common.confirm-password.label')} bind:value={confirmPassword} />
</Form>

{#if message}
	<p class="text-red-500 text-sm mt-2">{message}</p>
{/if}
