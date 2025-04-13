<script lang="ts">
    import FooterMenu from '../menu/FooterMenu.svelte';
    import MenuItem from '../menu/MenuItem.svelte';
    import { t } from 'svelte-i18n';
    import { isLoading } from 'svelte-i18n';
    import OpenSource from '../icons/OpenSource.svelte';
</script>

{#if !$isLoading}
    <footer class="w-full bg-gray-300 dark:bg-gray-950 p-5 pb-10">
        <div class="grid grid-cols-1 lg:grid-cols-3">
            <div class="px-1">
                <ul class="p-4">
                    <MenuItem target="_blank" footer href={import.meta.env.VITE_GITHUB_REPOSITORY}>
                        <OpenSource slot="iconLeft" />
                        {$t('menu.source-code')}
                    </MenuItem>
                </ul>
            </div>
            <div class="px-1">
                <FooterMenu />
            </div>
            <div class="px-1">
                <ul class="p-4">
                    <li class="p-2">
                        <p class="text-center">© 2025 Tassadraft Studio</p>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
{/if}
