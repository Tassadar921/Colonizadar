<script lang="ts">
	import Card from '../shared/Card.svelte';
	import { t } from 'svelte-i18n';
	import Title from '../shared/Title.svelte';
	import Breadcrumbs from '../shared/Breadcrumbs.svelte';

	interface Page {
		title: string;
		icon: string;
		href: string;
		description: string;
	}

	let pages: Page[] = [];

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
</script>

<Title title={$t('social.title')} />

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title') }]} />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
	{#each pages as page}
		<Card title={page.title} icon={page.icon} href={page.href} description={page.description} />
	{/each}
</div>
