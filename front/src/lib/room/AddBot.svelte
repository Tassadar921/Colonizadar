<script lang="ts">
	import Button from '../shared/Button.svelte';
	import axios from 'axios';
	import { showToast } from '../../services/toastService';
	import { t } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { profile } from '../../stores/profileStore';
	import type SerializedBotDifficulty from 'colonizadar-backend/app/types/serialized/serialized_bot_difficulty';
	import Plus from '../icons/Plus.svelte';

	export let room;
	export let difficulties: { value: string; label: string }[] = [];

	const checkedProfile = $profile!;

	onMount(async () => {
		try {
			const { data } = await axios.get('/api/room/bot-difficulties');
			difficulties = data.difficulties.map((difficulty: SerializedBotDifficulty) => ({ value: difficulty.id, label: difficulty.name }));
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
	});

	const handleAddBot = async () => {
		try {
			const { data } = await axios.post(`/api/room/${room.id}/add-bot`);
			showToast(`${$t('toast.room.add-bot.success')} : ${data.player.bot.name}`);
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
	};
</script>

{#if room.players.length < 6 && checkedProfile.id === room.owner.id}
	<div class="flex flex-grow justify-end">
		<Button
			ariaLabel="Add a bot"
			customStyle
			className="flex items-center gap-3 rounded-full hover:scale-105 bg-green-600 dark:bg-green-600 transition-all duration-300 p-2 px-4 text-xl"
			on:click={handleAddBot}
		>
			<Plus />
			<span>{$t('play.room.add-bot')}</span>
		</Button>
	</div>
{/if}
