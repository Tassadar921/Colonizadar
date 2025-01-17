<script>
    import Card from '../shared/Card.svelte';
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { transmit } from '../../stores/TransmitStore.js';
    import { onMount } from 'svelte';

    $: pages = [
        {
            title: $t('social.friends.title'),
            icon: 'people',
            href: '/social/friends',
            description: $t('social.friends.description'),
        },
        {
            title: $t('social.blocked.title'),
            icon: 'stop',
            href: '/social/blocked',
            description: $t('social.blocked.description'),
        },
        {
            title: $t('profile.title'),
            icon: 'user',
            href: '/profile',
            description: $t('profile.description'),
        },
    ];

    const setup = async () => {
        const subscription = $transmit.subscription('test');
        await subscription.create();
        subscription.onMessage((data) => {
            console.log(data);
        });
    };

    $: {
        console.log('ici');
        if ($transmit) {
            console.log('là');
            setup();
        }
    }
</script>

<Title title={$t('social.title')} />

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title') }]} />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
    {#each pages as page}
        <Card title={page.title} icon={page.icon} href={page.href} description={page.description} />
    {/each}
</div>
