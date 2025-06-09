<script lang="ts">
    import { Router, Route } from 'svelte-routing';
    import Homepage from './lib/pages/Home.svelte';
    import NotFound from './lib/pages/NotFound.svelte';
    import DarkMode from '$lib/shared/DarkMode.svelte';
</script>

<main class="flex flex-col w-screen h-screen">
    <DarkMode />
    <div class="px-3.5 min-h-screen">
        <Router>
            <Route path="/:language"><Homepage /></Route>
            <Route path="*"><NotFound /></Route>
        </Router>
    </div>
</main>
