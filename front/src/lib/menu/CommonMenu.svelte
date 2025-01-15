<script>
    import MenuItem from './MenuItem.svelte';
    import { t } from 'svelte-i18n';
    import { profile } from '../../stores/profileStore.js';

    export let footer = false;
</script>

<ul class={`${footer ? '' : 'space-y-4'} p-4`}>
    {#if $profile}
        <MenuItem {footer} iconLeft="home" href="/" on:click>{$t('menu.home')}</MenuItem>
        <MenuItem {footer} iconLeft="user" href="/profile" on:click>{$t('menu.profile')}</MenuItem>
        <MenuItem {footer} iconLeft="userRemove" href="/logout" on:click>{$t('menu.logout')}</MenuItem>
    {:else}
        <MenuItem {footer} iconLeft="user" href="/login" on:click>{$t('menu.login')}</MenuItem>
    {/if}
</ul>
