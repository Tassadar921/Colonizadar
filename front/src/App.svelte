<script lang="ts">
    import { Router } from 'svelte-routing';
    import { profile } from './stores/profileStore';
    import { isLoading } from 'svelte-i18n';
    import Footer from './lib/shared/Footer.svelte';
    import Loader from './lib/shared/Loader.svelte';
    import Menu from './lib/menu/Menu.svelte';
    import NotificationsSetup from './lib/notifications/NotificationsSetup.svelte';
    import AuthenticatedRoutes from "./lib/routes/AuthenticatedRoutes.svelte";
    import HybridRoutes from "./lib/routes/HybridRoutes.svelte";
    import GuessRoutes from "./lib/routes/GuessRoutes.svelte";
</script>

<NotificationsSetup />

<main class="flex flex-col bg-gray-200 dark:bg-gray-900 h-screen w-screen">
    <div class="px-3.5 min-h-screen">
        {#if !$isLoading}
            <Menu />
            <Router>
                {#if $profile}
                    <AuthenticatedRoutes />
                {:else}
                    <GuessRoutes />
                {/if}

                <HybridRoutes />
            </Router>
        {:else}
            <Loader isLoading />
        {/if}
    </div>
    <Footer />
</main>
