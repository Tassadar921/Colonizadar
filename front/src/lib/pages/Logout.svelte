<script lang="ts">
    import { showToast } from '../../services/toastService';
    import { navigate } from '../../stores/locationStore';
    import { clearProfile } from '../../stores/profileStore';
    import Subtitle from '../shared/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import ConfirmModal from '../shared/ConfirmModal.svelte';
    import axios from 'axios';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';

    let showModal: boolean = true;

    const handleSuccess = async (): Promise<void> => {
        try {
            const { data } = await axios.get('/api/logout');
            localStorage.removeItem('apiToken');
            localStorage.removeItem('apiTokenExpiration');
            localStorage.removeItem('subscribed');
            clearProfile();
            showToast(data.message);
            navigate('/login');
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
            navigate('/');
        }
    };

    const handleClose = (): void => {
        navigate('/');
    };
</script>

<Title title={$t('logout.title')} />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('logout.title') }]} />

<ConfirmModal bind:showModal on:success={handleSuccess} on:close={handleClose}>
    <Subtitle slot="header">{$t('logout.modal.title')}</Subtitle>
    <p>{$t('logout.modal.text')}</p>
</ConfirmModal>
