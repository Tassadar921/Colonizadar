<script lang="ts">
    import { Router } from 'svelte-routing';
    import { profile } from './stores/profileStore';
    import { isLoading } from 'svelte-i18n';
    import Loader from './lib/shared/Loader.svelte';
    import NotificationsSetup from './lib/notifications/NotificationsSetup.svelte';
    import AuthenticatedRoutes from './lib/routes/AuthenticatedRoutes.svelte';
    import HybridRoutes from './lib/routes/HybridRoutes.svelte';
    import GuessRoutes from './lib/routes/GuessRoutes.svelte';
</script>

<NotificationsSetup />

<main class="flex flex-col bg-gray-200 dark:bg-gray-900 h-screen w-screen">
    {#if !$isLoading}
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
</main>
