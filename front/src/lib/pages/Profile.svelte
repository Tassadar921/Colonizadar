<script lang="ts">
    import Form from '../shared/Form.svelte';
    import Input from '../shared/Input.svelte';
    import Title from '../shared/Title.svelte';
    import Link from '../shared/Link.svelte';
    import { profile, setProfile } from '../../stores/profileStore';
    import { showToast } from '../../services/toastService';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import FileUpload from '../shared/FileUpload.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import type SerializedUser from 'colonizadar-backend/app/types/serialized/serialized_user';

    let formValues: { username: string; email: string } = {
        username: '',
        email: '',
    };
    let path: string = '';
    let canSubmit: boolean = false;

    let profileData: SerializedUser = $profile!;

    onMount((): void => {
        formValues = {
            username: $profile?.username || '',
            email: $profile?.email || '',
        };

        if ($profile!.profilePicture) {
            path = `${import.meta.env.VITE_API_BASE_URL}/api/static/profile-picture/${$profile!.id}?token=${localStorage.getItem('apiToken')}`;
        }
    });

    const handleSuccess = (event: CustomEvent): void => {
        setProfile(event.detail.user);
        showToast(event.detail.message);
    };

    const handleError = (): void => {
        formValues = {
            username: $profile!.username,
            email: $profile!.email,
        };
    };

    $: canSubmit = !!formValues.username && !!formValues.email;
</script>

<Title title={$t('profile.title')} hasBackground />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title'), path: '/social' }, { label: $t('profile.title') }]} />

<Form action="/api/profile/update" method="POST" on:success={handleSuccess} on:error={handleError} isValid={canSubmit}>
    <Input name="username" placeholder={$t('common.username.label')} label={$t('common.username.label')} bind:value={formValues.username} min={3} max={50} />
    <Input name="email" placeholder={$t('common.email.label')} label={$t('common.email.label')} bind:value={formValues.email} disabled />
    <Link href="/reset-password" className="text-primary-500 hover:text-primary-800 transition-colors duration-300">
        {$t('profile.reset-password')}
    </Link>
    <FileUpload
        name="profilePicture"
        accept="png jpg gif jpeg webp"
        fileName={profileData.profilePicture?.name}
        title={$t('profile.profile-picture.title')}
        description={$t('profile.profile-picture.description')}
        pathPrefix="profile-picture"
        id={profileData.id}
    />
</Form>
