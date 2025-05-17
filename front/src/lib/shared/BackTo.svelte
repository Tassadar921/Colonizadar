<script lang="ts">
    import Button from './Button.svelte';
    import Link from './Link.svelte';
    import Icon from './Icon.svelte';

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
