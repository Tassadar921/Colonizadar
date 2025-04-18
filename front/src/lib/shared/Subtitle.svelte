<script lang="ts">
	export let style: string = '';
	export let className: string = 'text-xl font-bold relative';
</script>

<h2 {style} class={className}><slot /></h2>
