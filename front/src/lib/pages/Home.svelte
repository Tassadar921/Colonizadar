<script lang="ts">
	import Card from '../shared/Card.svelte';
	import { t } from 'svelte-i18n';
	import Title from '../shared/Title.svelte';
	import Incrementation from '../shared/Incrementation.svelte';

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

<Incrementation value={1000} smallStep={1000} smallShiftStep={10000} largeStep={100000} largeShiftStep={1000000} canDecrement={true} canIncrement={true} />
