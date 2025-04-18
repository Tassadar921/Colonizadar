<script lang="ts">
	import Button from './Button.svelte';
	import Link from './Link.svelte';
	import ArrowLeft from '../icons/ArrowLeft.svelte';

	export let href: string;
	export let text: string;
</script>

<Button>
	<Link {href}>
		<div class="inline-block">
			<div class="flex flex-row gap-1">
				<ArrowLeft />
				<p>{text}</p>
			</div>
		</div>
	</Link>
</Button>
