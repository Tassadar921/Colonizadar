<script lang="ts">
    import { Router, Route } from 'svelte-routing';
    import Homepage from './lib/pages/Home.svelte';
    import Login from './lib/pages/Login.svelte';
    import Logout from './lib/pages/Logout.svelte';
    import ResetPassword from './lib/pages/ResetPassword.svelte';
    import ConfirmResetPassword from './lib/pages/ConfirmResetPassword.svelte';
    import Forbidden from './lib/pages/Forbidden.svelte';
    import { profile } from './stores/profileStore';
    import NotFound from './lib/pages/NotFound.svelte';
    import Profile from './lib/pages/Profile.svelte';
    import { isLoading } from 'svelte-i18n';
    import Footer from './lib/shared/Footer.svelte';
    import Loader from './lib/shared/Loader.svelte';
    import AlreadyConnected from './lib/pages/AlreadyConnected.svelte';
    import Notifications from './lib/pages/Notifications.svelte';
    import Menu from './lib/menu/Menu.svelte';
    import Social from './lib/pages/Social.svelte';
    import Friends from './lib/pages/Friends.svelte';
    import Blocked from './lib/pages/Blocked.svelte';
    import NotificationsSetup from './lib/notifications/NotificationsSetup.svelte';
    import Play from './lib/pages/Play.svelte';
    import Room from './lib/pages/Room.svelte';
    import Game from './lib/pages/Game.svelte';
    import Oauth from './lib/pages/Oauth.svelte';
    import CreateAccount from './lib/pages/CreateAccount.svelte';
    import ConfirmAccountCreation from './lib/pages/ConfirmAccountCreation.svelte';
</script>

<NotificationsSetup />

<main class="flex flex-col bg-gray-200 dark:bg-gray-900 h-screen w-screen">
    <div class="px-3.5 min-h-screen">
        {#if !$isLoading}
            <Menu />
            <Router>
                <Route path="/:language/reset-password"><ResetPassword /></Route>
                <Route path="/:language/reset-password/confirm/:token" let:params><ConfirmResetPassword token={params.token} /></Route>

                {#if $profile}
                    <Route path="/:language"><Homepage /></Route>

                    <Route path="/:language/oauth/:apiToken"><AlreadyConnected /></Route>
                    <Route path="/:language/login"><AlreadyConnected /></Route>
                    <Route path="/:language/create-account"><AlreadyConnected /></Route>
                    <Route path="/:language/create-account/confirm/:token"><AlreadyConnected /></Route>

                    <Route path="/:language/social"><Social /></Route>
                    <Route path="/:language/social/friends"><Friends /></Route>
                    <Route path="/:language/social/blocked"><Blocked /></Route>

                    <Route path="/:language/play"><Play /></Route>
                    <Route path="/:language/play/room/:roomId" let:params>
                        <Room key={params.roomId} roomId={params.roomId} />
                    </Route>
                    <Route path="/:language/play/game/:gameId" let:params>
                        <Game key={params.roomId} gameId={params.gameId} />
                    </Route>

                    <Route path="/:language/profile"><Profile /></Route>
                    <Route path="/:language/notifications"><Notifications /></Route>
                    <Route path="/:language/logout"><Logout /></Route>
                {:else}
                    <Route path="/:language/"><Login /></Route>

                    <Route path="/:language/oauth/:apiToken" let:params><Oauth apiToken={params.apiToken} /></Route>
                    <Route path="/:language/login"><Login /></Route>
                    <Route path="/:language/create-account"><CreateAccount /></Route>
                    <Route path="/:language/create-account/confirm/:token" let:params><ConfirmAccountCreation token={params.token} /></Route>

                    <Route path="/:language/social"><Forbidden /></Route>
                    <Route path="/:language/social/friends"><Forbidden /></Route>
                    <Route path="/:language/social/blocked"><Forbidden /></Route>

                    <Route path="/:language/play"><Play /></Route>
                    <Route path="/:language/play/room/:roomId"><Forbidden /></Route>
                    <Route path="/:language/play/game/:gameId"><Forbidden /></Route>

                    <Route path="/:language/profile"><Forbidden /></Route>
                    <Route path="/:language/notifications"><Forbidden /></Route>
                    <Route path="/:language/logout"><Forbidden /></Route>
                {/if}

                <Route path="*"><NotFound /></Route>
            </Router>
        {:else}
            <Loader isLoading />
        {/if}
    </div>
    <Footer />
</main>
