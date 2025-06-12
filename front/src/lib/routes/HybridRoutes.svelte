<script lang="ts">
    import ResetPassword from '../pages/ResetPassword.svelte';
    import { Route } from 'svelte-routing';
    import ConfirmResetPassword from '../pages/ConfirmResetPassword.svelte';
    import NotFound from '../pages/NotFound.svelte';
    import AppLayout from '../layouts/AppLayout.svelte';
</script>

<Route path="/:language/reset-password">
    <AppLayout component={ResetPassword} />
</Route>
<Route path="/:language/reset-password/confirm/:token" let:params>
    <AppLayout component={ConfirmResetPassword} props={{ token: params.token }} />
</Route>
<Route path="*">
    <AppLayout component={NotFound} />
</Route>
