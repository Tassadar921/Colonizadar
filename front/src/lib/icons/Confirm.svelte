<script lang="ts">
    export let size: number = 24;
</script>

<svg class="transition-all duration-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l6 6l10 -10">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0" />
    </path>
</svg>
