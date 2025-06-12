<script lang="ts">
    import { Route } from 'svelte-routing';
    import AppLayout from '../layouts/AppLayout.svelte';

    import CreateAccount from '../pages/CreateAccount.svelte';
    import Login from '../pages/Login.svelte';
    import ConfirmAccountCreation from '../pages/ConfirmAccountCreation.svelte';
    import Oauth from '../pages/Oauth.svelte';
    import Forbidden from '../pages/Forbidden.svelte';
</script>

<Route path="/:language/">
    <AppLayout component={Login} />
</Route>

<Route path="/:language/oauth/:apiToken" let:params>
    <AppLayout component={Oauth} props={{ apiToken: params.apiToken }} />
</Route>

<Route path="/:language/login">
    <AppLayout component={Login} />
</Route>

<Route path="/:language/create-account">
    <AppLayout component={CreateAccount} />
</Route>

<Route path="/:language/create-account/confirm/:token" let:params>
    <AppLayout component={ConfirmAccountCreation} props={{ token: params.token }} />
</Route>

<!-- Protected routes show "Forbidden" -->
<Route path="/:language/social">
    <AppLayout component={Forbidden} />
</Route>

<Route path="/:language/social/friends">
    <AppLayout component={Forbidden} />
</Route>

<Route path="/:language/social/blocked">
    <AppLayout component={Forbidden} />
</Route>

<Route path="/:language/play">
    <AppLayout component={Forbidden} />
</Route>

<Route path="/:language/play/room/:roomId">
    <AppLayout component={Forbidden} />
</Route>

<Route path="/:language/play/game/:gameId">
    <AppLayout component={Forbidden} />
</Route>

<Route path="/:language/profile">
    <AppLayout component={Forbidden} />
</Route>

<Route path="/:language/notifications">
    <AppLayout component={Forbidden} />
</Route>

<Route path="/:language/logout">
    <AppLayout component={Forbidden} />
</Route>
