<script lang="ts">
    import MenuItem from './MenuItem.svelte';
    import { t } from 'svelte-i18n';
    import { profile } from '../../stores/profileStore';

    export let footer: boolean = false;
</script>

<ul class={`${footer ? '' : 'space-y-4'} p-4`}>
    {#if $profile}
        <MenuItem {footer} iconLeft="home" href="/" on:click>{$t('home.title')}</MenuItem>
        <MenuItem {footer} iconLeft="game" href="/play" on:click>{$t('play.title')}</MenuItem>
        <MenuItem {footer} iconLeft="people" href="/social" on:click>{$t('social.title')}</MenuItem>
        <MenuItem {footer} iconLeft="user" href="/profile" on:click>{$t('profile.title')}</MenuItem>
        <MenuItem {footer} iconLeft="userRemove" href="/logout" on:click>{$t('logout.title')}</MenuItem>
    {:else}
        <MenuItem {footer} iconLeft="user" href="/login" on:click>{$t('login.title')}</MenuItem>
    {/if}
</ul>
