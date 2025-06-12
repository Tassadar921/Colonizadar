<script lang="ts">
    import { Router, Route } from 'svelte-routing';
    import Homepage from './lib/pages/Home.svelte';
    import NotFound from './lib/pages/NotFound.svelte';
    import DarkMode from '$lib/shared/DarkMode.svelte';
    import AppLayout from '$lib/layouts/AppLayout.svelte';
</script>

<main class="flex flex-col w-screen h-screen">
    <DarkMode />
    <Router>
        <Route path="/:language">
            <AppLayout component={Homepage} />
        </Route>
        <Route path="*">
            <AppLayout component={NotFound} />
        </Route>
    </Router>
</main>
