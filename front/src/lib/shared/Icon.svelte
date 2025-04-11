<script lang="ts">
    import type { SvelteComponent } from "svelte";

    export let name: string = '';
    export let size: number = 24;

    let IconComponent: typeof SvelteComponent | null = null;

    const validIcons: string[] = [
        'Book', 'Camera', 'Moon', 'Sun', 'Burger', 'Close', 'Settings',
        'ChevronLeft', 'ChevronRight', 'DoubleArrowLeft', 'DoubleArrowRight', 'Home',
        'User', 'UserRemove', 'Eye', 'EyeSlash', 'Trash', 'Undo', 'ArrowDown',
        'ArrowUp', 'Euro', 'Dollar', 'Upload', 'Search', 'Pen', 'Plus',
        'Minus', 'Save', 'Check', 'Exchange', 'PaperClip', 'Send', 'Download',
        'Help', 'Clear', 'ArrowLeft', 'ArrowRight', 'OpenSource', 'ChevronDown',
        'ChevronUp', 'EnglishFlag', 'FrenchFlag', 'People', 'Game', 'Stop', 'Bell',
        'RemoveUser', 'AddUser', 'Unblock', 'Confirm', 'Crown', 'Invite', 'Copy', 'Bot'
    ];

    const toCamelCase = (str: string): string => {
        if (str.length === 0) {
            return '';
        }
        return str[0].toUpperCase() + str.slice(1);
    };

    const setIcon = async (name: string): Promise<void> => {
        const camelCaseName = toCamelCase(name);
        if (validIcons.includes(camelCaseName)) {
            IconComponent = (await import(`../icons/${camelCaseName}.svelte`)).default;
        } else {
            throw new Error(`Invalid icon name: ${name}`);
        }
    };

    $: {
        setIcon(name);
    }
</script>

{#if IconComponent}
    <svelte:component this={IconComponent} {size} class="transition-all duration-300" />
{/if}
