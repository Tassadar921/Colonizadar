<script>
    import Card from '../shared/Card.svelte';
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';

    let products = [];

    $: products = [
        {
            title: $t('friends.title'),
            icon: 'upload',
            href: '/upload',
            description: $t('upload.description'),
        },
        {
            title: $t('play.title'),
            icon: 'search',
            href: '/browse',
            description: $t('browse.description'),
        },
    ];
</script>

<Title title={$t('home.title')} />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
    {#each products as product}
        <Card title={product.title} icon={product.icon} href={product.href} description={product.description} />
    {/each}
</div>
