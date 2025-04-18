<script lang="ts">
	import MenuItem from './MenuItem.svelte';
	import { t } from 'svelte-i18n';
	import { profile } from '../../stores/profileStore';
	import Home from '../icons/Home.svelte';
	import Game from '../icons/Game.svelte';
	import People from '../icons/People.svelte';
	import User from '../icons/User.svelte';
	import UserRemove from '../icons/UserRemove.svelte';

	export let footer: boolean = false;
</script>

<ul class={`${footer ? '' : 'space-y-4'} p-4`}>
	{#if $profile}
		<MenuItem {footer} href="/" on:click>
			<Home slot="iconLeft" />
			{$t('home.title')}
		</MenuItem>
		<MenuItem {footer} href="/play" on:click>
			<Game slot="iconLeft" />
			{$t('play.title')}
		</MenuItem>
		<MenuItem {footer} href="/social" on:click>
			<People slot="iconLeft" />
			{$t('social.title')}
		</MenuItem>
		<MenuItem {footer} href="/profile" on:click>
			<User slot="iconLeft" />
			{$t('profile.title')}
		</MenuItem>
		<MenuItem {footer} href="/logout" on:click>
			<UserRemove slot="iconLeft" />
			{$t('logout.title')}
		</MenuItem>
	{:else}
		<MenuItem {footer} href="/login" on:click>
			<User slot="iconLeft" />
			{$t('login.title')}
		</MenuItem>
	{/if}
</ul>
