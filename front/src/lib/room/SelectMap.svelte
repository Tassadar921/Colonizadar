<script lang="ts">
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import { onMount } from 'svelte';
    import { profile } from '../../stores/profileStore';
    import type SerializedMap from 'colonizadar-backend/app/types/serialized/serialized_map';
    import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';

    export let room: SerializedRoom;
    export let maps: SerializedMap[] = [];

    const checkedProfile = $profile!;

    onMount(async () => {
        try {
            const { data } = await axios.get('/api/room/maps');
            maps = data;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    });

    const handleSelectMap = async (): Promise<void> => {
        try {
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };
</script>

{#if checkedProfile.id === room.owner.id}
    <div class="flex flex-grow justify-end"></div>
{/if}
