<script lang="ts">
    import { onMount } from 'svelte';
    import Button from '../shared/Button.svelte';
    import Icon from '../shared/Icon.svelte';
    import { locale } from 'svelte-i18n';
    import { setLanguage } from '../../stores/languageStore';
    import { location, navigate } from '../../stores/locationStore';
    import axios from 'axios';

    interface Flag {
        icon: string;
        label: string;
        value: string;
    }

    let flags: Flag[] = [
        { icon: 'englishFlag', label: 'English', value: 'en' },
        { icon: 'frenchFlag', label: 'Français', value: 'fr' },
    ];
    let selectedFlag: Flag = flags[0];
    let chevronIcon = 'chevronDown';
    let isExpanded = false;
    let popoverEl: HTMLDivElement;
    let buttonContainerElement: HTMLDivElement;

    const togglePopover = (): void => {
        isExpanded = !isExpanded;
    };

    const selectFlag = (flag: Flag): void => {
        const initialLanguage = localStorage.getItem('language');
        if (initialLanguage === flag.value) {
            return;
        }

        setLanguage(flag.value);
        locale.set(flag.value);
        axios.defaults.headers.common['Accept-Language'] = `${flag.value}-${flag.value.toUpperCase()}`;
        selectedFlag = flag;

        const currentPath = $location.replace(`/${initialLanguage}`, '');
        navigate(`/${flag.value}${currentPath}`);

        isExpanded = false;
    };

    const handleClickOutside = (event: MouseEvent): void => {
        if (popoverEl && !popoverEl.contains(event.target as Node) && !buttonContainerElement.contains(event.target as Node)) {
            isExpanded = false;
        }
    };

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    });

    $: selectedFlag = flags.find((flag: Flag) => flag.value === localStorage.getItem('language')) || flags[0];
</script>

<div class="relative inline-block" bind:this={buttonContainerElement}>
    <Button customStyle className="mb-2 flex items-center space-x-2" on:click={togglePopover}>
<!--        <Icon bind:name={selectedFlag.icon} />-->
        <div class="dark:text-primary-500 transform transition-transform duration-300" class:rotate-180={isExpanded}>
<!--            <Icon bind:name={chevronIcon} />-->
        </div>
    </Button>

    {#if isExpanded}
        <div class="absolute mt-2 bg-white dark:bg-gray-800 shadow-md rounded-lg z-50 w-32 p-2 border border-gray-200" bind:this={popoverEl} style="right: 0;">
            {#each flags as flag}
                <Button
                    customStyle
                    className="w-full flex items-center space-x-2 mb-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md shadow-md {selectedFlag.value === flag.value ? 'shadow-green-500' : ''}"
                    on:click={() => selectFlag(flag)}
                >
<!--                    <Icon name={flag.icon} />-->
                    <p class="capitalize">{flag.label}</p>
                </Button>
            {/each}
        </div>
    {/if}
</div>
