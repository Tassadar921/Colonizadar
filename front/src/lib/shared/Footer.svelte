<script>
    import FooterMenu from '../menu/FooterMenu.svelte';
    import MenuItem from '../menu/MenuItem.svelte';
    import { t } from 'svelte-i18n';
</script>

<footer class="w-full bg-gray-300 dark:bg-gray-950 p-5 pb-10">
    <div class="grid grid-cols-1 lg:grid-cols-3">
        <div class="px-1">
            <ul class="p-4">
                <MenuItem target="_blank" footer iconLeft="openSource" href={process.env.VITE_GITHUB_REPOSITORY}>{$t('menu.source-code')}</MenuItem>
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
