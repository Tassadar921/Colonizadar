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
    import { location, navigate } from './stores/locationStore.js';
    import { locale } from 'svelte-i18n';
    import { showToast } from './services/toastService.js';
    import Social from './lib/pages/Social.svelte';
    import Friends from './lib/pages/Friends.svelte';
    import Blocked from './lib/pages/Blocked.svelte';
    import { transmit } from './stores/TransmitStore.js';
    import { Transmit } from '@adonisjs/transmit-client';

    const supportedLanguages = ['en', 'fr'];

    const initializeLanguage = () => {
        const langRegex = new RegExp(`^\/(${supportedLanguages.join('|')})(\/|$)`);
        const langMatch = langRegex.exec($location);

        const initialSetLanguage = (language) => {
            setLanguage(language);
            locale.set(language);
        };

        let language = langMatch ? langMatch[1] : null;
        if (!language || !supportedLanguages.includes(language)) {
            language = 'en';
            initialSetLanguage(language);
            showToast('Invalid language. Defaulting to English.', 'error');
            navigate(`/${language}`);
        } else {
            initialSetLanguage(language);
        }
    };

    const logInformations = async (token) => {
        const tokenExpiresAt = localStorage.getItem('apiTokenExpiration');
        if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) {
            localStorage.removeItem('apiToken');
            localStorage.removeItem('apiTokenExpiration');
            return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            await axios.get('/api');
        } catch (e) {
            localStorage.removeItem('apiToken');
            axios.defaults.headers.common['Authorization'] = '';
        }
    };

    onMount(async () => {
        axios.defaults.baseURL = process.env.VITE_API_BASE_URL;
        initializeLanguage();

        const theme = localStorage.getItem('theme');
        if (theme !== 'light' && theme !== 'dark') {
            localStorage.setItem('theme', 'light');
        }

        const token = localStorage.getItem('apiToken');
        if (token) {
            await logInformations(token);
            await updateProfile();
        }

        transmit.set(new Transmit({ baseUrl: process.env.VITE_API_BASE_URL }));
        const notification = $transmit.subscription(`notification/${$profile.id}`);
        await notification.create();
        notification.onMessage((data) => {
            showToast(data.message, 'warning');
        });
    });
</script>

<main class="flex flex-col bg-gray-200 dark:bg-gray-900 min-h-screen min-w-screen">
    <div class="px-3.5 min-h-screen">
        <Menu />
        {#if !$isLoading}
            <Router>
                <Route path="/:language/reset-password" component={ResetPassword} />
                <Route path="/:language/reset-password/confirm/:token" let:params><ConfirmResetPassword {...params} /></Route>

                {#if $profile}
                    <Route path="/:language" component={Homepage} />
                    <Route path="/:language/login" component={AlreadyConnected} />

                    <Route path="/:language/social" component={Social} />
                    <Route path="/:language/social/friends" component={Friends} />
                    <Route path="/:language/social/blocked" component={Blocked} />

                    <Route path="/:language/profile" component={Profile} />
                    <Route path="/:language/logout" component={Logout} />
                {:else}
                    <Route path="/:language/" component={Login} />
                    <Route path="/:language/login" component={Login} />

                    <Route path="/:language/social" component={Forbidden} />
                    <Route path="/:language/social/friends" component={Forbidden} />
                    <Route path="/:language/social/blocked" component={Forbidden} />

                    <Route path="/:language/profile" component={Forbidden} />
                    <Route path="/:language/logout" component={Forbidden} />
                {/if}

                <Route path="*" component={NotFound} />
            </Router>
        {:else}
            <Loader loading={true} />
        {/if}
    </div>
    <Footer />
</main>
