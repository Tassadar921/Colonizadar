<script lang="ts">
    import Form from '../shared/Form.svelte';
    import Input from '../shared/Input.svelte';
    import PasswordInput from '../shared/PasswordInput.svelte';
    import { showToast } from '../../services/toastService';
    import axios from 'axios';
    import Title from '../shared/Title.svelte';
    import Link from '../shared/Link.svelte';
    import { navigate } from '../../stores/locationStore';
    import { updateProfile } from '../../stores/profileStore';
    import { t } from 'svelte-i18n';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';

    let email: string = '';
    let password: string = '';
    let canSubmit: boolean = false;

    const handleSuccess = async (event: CustomEvent): Promise<void> => {
        localStorage.setItem('apiToken', event.detail.token.token);
        localStorage.setItem('apiTokenExpiration', event.detail.token.expiresAt);
        axios.defaults.headers.common['Authorization'] = `Bearer ${event.detail.token.token}`;

        await updateProfile(event.detail.user);

        showToast($t('toast.login.success'));
        navigate('/');
    };

    $: canSubmit = !!email && !!password;
</script>

<Title title={$t('login.title')} hasBackground />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('login.title') }]} />

<Form action="/api/login" method="post" on:success={handleSuccess} isValid={canSubmit}>
    <Input type="email" name="email" placeholder={$t('common.email.placeholder')} label={$t('common.email.label')} bind:value={email} />
    <PasswordInput bind:value={password} />
    <div class="w-full mb-3">
        <Link href="/reset-password" className="text-primary-500 hover:text-white duration-300 transition-colors">Forgot password ?</Link>
    </div>
</Form>
