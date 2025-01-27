<script>
    import {t} from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import {onMount} from "svelte";
    import Breadcrumbs from "../shared/Breadcrumbs.svelte";
    import {showToast} from "../../services/toastService.js";
    import {navigate} from "../../stores/locationStore.js";
    import axios from "axios";

    export let roomId;

    let room = { name: '' };

    onMount(async () => {
        const loadingError = () => {
            showToast($t('toast.room.error'), 'error');
            navigate('/play');
        };
        if (!roomId) {
            loadingError();
        }
        const response = await axios.get(`/api/room/${roomId}`);
        if (response.status !== 200) {
            loadingError();
        }
        room = response.data.room;
        console.log(room);
    });
</script>

<Title title={room.name ? room.name : $t('play.room.title')}/>

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('play.title'), path: '/play' }, { label: $t('play.room.title') }]} hasBackground/>
