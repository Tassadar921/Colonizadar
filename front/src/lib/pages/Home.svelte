<script lang="ts">
	import Card from '../shared/Card.svelte';
	import { t } from 'svelte-i18n';
	import Title from '../shared/Title.svelte';
	import Range from '../shared/Range.svelte';

	interface Page {
		title: string;
		icon: string;
		href: string;
		description: string;
	}

	let pages: Page[] = [];

	$: pages = [
		{
			title: $t('play.title'),
			icon: 'game',
			href: '/play',
			description: $t('play.description'),
		},
		{
			title: $t('social.title'),
			icon: 'people',
			href: '/social',
			description: $t('social.description'),
		},
	];
</script>

<Title title={$t('home.title')} />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
	{#each pages as page}
		<Card title={page.title} icon={page.icon} href={page.href} description={page.description} />
	{/each}
</div>

<Range min={4} max={12} step={1} />
