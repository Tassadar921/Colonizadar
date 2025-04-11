<script lang="ts">
    import Icon from './Icon.svelte';
    import Button from './Button.svelte';
    import Link from './Link.svelte';

    export let href: string;
    export let text: string;
</script>

<Button>
    <Link {href}>
        <div class="inline-block">
            <div class="flex flex-row gap-1">
                <Icon name="arrowLeft" />
                <p>{text}</p>
            </div>
        </div>
    </Link>
</Button>
