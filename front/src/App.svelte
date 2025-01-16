<script>
    import { onMount } from 'svelte';
    import { Router, Route } from 'svelte-routing';
    import Homepage from './lib/pages/Home.svelte';
    import Login from './lib/pages/Login.svelte';
    import Logout from './lib/pages/Logout.svelte';
    import ResetPassword from './lib/pages/ResetPassword.svelte';
    import ConfirmResetPassword from './lib/pages/ConfirmResetPassword.svelte';
    import Forbidden from './lib/pages/Forbidden.svelte';
    import { updateProfile, profile } from './stores/profileStore.js';
    import NotFound from './lib/pages/NotFound.svelte';
    import axios from 'axios';
    import Profile from './lib/pages/Profile.svelte';
    import { isLoading } from 'svelte-i18n';
    import Footer from './lib/shared/Footer.svelte';
    import Loader from './lib/shared/Loader.svelte';
    import AlreadyConnected from './lib/pages/AlreadyConnected.svelte';
    import Menu from './lib/menu/Menu.svelte';
    import { setLanguage } from './stores/languageStore.js';

    export let url = '';

    const logInformations = async (token) => {
        const tokenExpiresAt = localStorage.getItem('apiTokenExpiration');
        if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) {
            localStorage.removeItem('apiToken');
            localStorage.removeItem('apiTokenExpiration');
            return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios
            .get('/api')
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Invalid token');
                }
            })
            .catch(() => {
                localStorage.removeItem('apiToken');
                axios.defaults.headers.common['Authorization'] = '';
            });
    };

    onMount(async () => {
        axios.defaults.baseURL = process.env.VITE_API_BASE_URL;
        setLanguage(localStorage.getItem('language'));

        const theme = localStorage.getItem('theme');
        if (theme !== 'light' && theme !== 'dark') {
            localStorage.setItem('theme', 'light');
        }

        const token = localStorage.getItem('apiToken');
        if (token) {
            await logInformations(token);
            await updateProfile();
        }
    });
</script>

<main class="flex flex-col bg-gray-200 dark:bg-gray-900 min-h-screen min-w-screen">
    <div class="px-3.5 min-h-screen">
        <Menu />
        {#if !$isLoading}
            <Router {url}>
                <Route path="/reset-password"><ResetPassword /></Route>
                <Route path="/reset-password/confirm/:token" let:params><ConfirmResetPassword {...params} /></Route>

                {#if $profile}
                    <Route path="/"><Homepage /></Route>
                    <Route path="/login"><AlreadyConnected /></Route>

                    <Route path="/profile"><Profile /></Route>
                    <Route path="/logout"><Logout /></Route>
                {:else}
                    <Route path="/"><Login /></Route>
                    <Route path="/login"><Login /></Route>

                    <Route path="/profile"><Forbidden /></Route>
                    <Route path="/logout"><Forbidden /></Route>
                {/if}

                <Route path="*"><NotFound /></Route>
            </Router>
        {:else}
            <Loader loading={true} />
        {/if}
    </div>
    <Footer />
</main>
