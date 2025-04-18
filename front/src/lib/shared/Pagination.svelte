<script lang="ts">
	import Button from './Button.svelte';
	import axios from 'axios';
	import Loader from './Loader.svelte';
	import ChevronRight from '../icons/ChevronRight.svelte';
	import DoubleArrowRight from '../icons/DoubleArrowRight.svelte';
	import DoubleArrowLeft from '../icons/DoubleArrowLeft.svelte';
	import ArrowLeft from '../icons/ArrowLeft.svelte';

	interface PaginatedObject {
		currentPage: number;
		firstPage: number;
		lastPage: number;
		perPage: number;
		total: number;
	}

	export let baseUrl;
	export let paginatedObject: PaginatedObject;
	export let containerRef = window;

	let canGoBack: boolean = false;
	let canGoForward: boolean = false;
	let isLoading: boolean = false;

	const handleClick = async (page: number, perPage: number) => {
		try {
			isLoading = true;
			const { data } = await axios.get(`${baseUrl}&page=${page}&perPage=${perPage}`);
			paginatedObject = data;
		} catch (error: any) {
			console.error('Failed to fetch paginated data:', error);
		} finally {
			isLoading = false;
			if (containerRef) {
				containerRef.scrollTo({
					top: 0,
					behavior: 'smooth',
				});
			}
		}
	};
	$: canGoBack = paginatedObject.currentPage > paginatedObject.firstPage;
	$: canGoForward = paginatedObject.currentPage < paginatedObject.lastPage;
</script>

<div class="my-2 flex flex-row gap-3 justify-center" class:hidden={paginatedObject.lastPage === 1}>
	{#if paginatedObject.currentPage}
		{#if !isLoading}
			<!-- First Page Button -->
			<Button disabled={!canGoBack} on:click={() => handleClick(paginatedObject.firstPage, paginatedObject.perPage)}>
				<DoubleArrowLeft />
			</Button>
			<!-- Previous Page Button -->
			<Button disabled={!canGoBack} on:click={() => handleClick(paginatedObject.currentPage - 1, paginatedObject.perPage)}>
				<ArrowLeft />
			</Button>
			<!-- Page Indicator -->
			<p>
				{paginatedObject.currentPage} / {paginatedObject.lastPage}
			</p>
			<!-- Next Page Button -->
			<Button disabled={!canGoForward} on:click={() => handleClick(paginatedObject.currentPage + 1, paginatedObject.perPage)}>
				<ChevronRight />
			</Button>
			<!-- Last Page Button -->
			<Button disabled={!canGoForward} on:click={() => handleClick(paginatedObject.lastPage, paginatedObject.perPage)}>
				<DoubleArrowRight />
			</Button>
		{:else}
			<Loader bind:isLoading />
		{/if}
	{/if}
</div>
