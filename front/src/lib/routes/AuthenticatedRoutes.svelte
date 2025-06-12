<script lang="ts">
    import { Route } from 'svelte-routing';
    import AppLayout from '../layouts/AppLayout.svelte';

    import Home from '../pages/Home.svelte';
    import Profile from '../pages/Profile.svelte';
    import Logout from '../pages/Logout.svelte';
    import AlreadyConnected from '../pages/AlreadyConnected.svelte';
    import Social from '../pages/Social.svelte';
    import Friends from '../pages/Friends.svelte';
    import Blocked from '../pages/Blocked.svelte';
    import Notifications from '../pages/Notifications.svelte';
    import Game from '../pages/Game.svelte';
    import Room from '../pages/Room.svelte';
    import Play from '../pages/Play.svelte';
</script>

<Route path="/:language">
    <AppLayout component={Home} />
</Route>

<Route path="/:language/oauth/:apiToken">
    <AppLayout component={AlreadyConnected} />
</Route>

<Route path="/:language/login">
    <AppLayout component={AlreadyConnected} />
</Route>

<Route path="/:language/create-account">
    <AppLayout component={AlreadyConnected} />
</Route>

<Route path="/:language/create-account/confirm/:token">
    <AppLayout component={AlreadyConnected} />
</Route>

<Route path="/:language/social">
    <AppLayout component={Social} />
</Route>

<Route path="/:language/social/friends">
    <AppLayout component={Friends} />
</Route>

<Route path="/:language/social/blocked">
    <AppLayout component={Blocked} />
</Route>

<Route path="/:language/play">
    <AppLayout component={Play} />
</Route>

<Route path="/:language/play/room/:roomId" let:params>
    <AppLayout component={Room} props={{ key: params.roomId, roomId: params.roomId }} />
</Route>

<Route path="/:language/play/game/:gameId" let:params>
    <AppLayout component={Game} props={{ key: params.gameId, gameId: params.gameId }} />
</Route>

<Route path="/:language/profile">
    <AppLayout component={Profile} />
</Route>

<Route path="/:language/notifications">
    <AppLayout component={Notifications} />
</Route>

<Route path="/:language/logout">
    <AppLayout component={Logout} />
</Route>
