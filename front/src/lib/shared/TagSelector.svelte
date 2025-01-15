<script>
    import { t } from 'svelte-i18n';
    import Search from './Search.svelte';
    import axios from 'axios';
    import { onMount } from 'svelte';
    import TagItem from './TagItem.svelte';
    import SelectedTag from './SelectedTag.svelte';
    import IconButton from './IconButton.svelte';
    import { showToast } from '../../services/toastService.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let selectedTags = [];
    export let update = false;
    export let allowCreateTag = false;
    export let id = null;

    let menuOpen = false;
    let query = '';

    let tags = [];
    let filteredTags = [];

    let isSaveDisabled = true;

    onMount(async () => {
        await getItemsRequest();
    });

    const handleFocusOut = (event) => {
        if (!event.relatedTarget?.closest('#myDropdown')) {
            menuOpen = false;
        }
    };

    const handleSearch = async (event) => {
        if (!query) {
            return;
        }

        filteredTags = tags.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

        if (event.detail) {
            const foundTag = tags.find((item) => item.name.toLowerCase() === query.toLowerCase());
            if (foundTag) {
                await selectItem(foundTag, false);
                menuOpen = false;
            } else if (allowCreateTag) {
                try {
                    const { data } = await axios.post('/api/tags/new', { name: query.toLowerCase() });
                    await selectItem(data.tag, false);
                    menuOpen = false;
                } catch (e) {
                    showToast($t('toast.tags.new.error'), 'error');
                }
            }
        } else {
            await getItemsRequest();
            filteredTags = tags.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
        }

        filteredTags = [...filteredTags];
        menuOpen = true;
    };

    const handleDeleteTag = async (tag) => {
        selectedTags = selectedTags.filter((item) => item.name !== tag.name);
        await getItemsRequest();
        isSaveDisabled = false;
        dispatch('delete');
    };

    const selectItem = async (tag, sendRequest = true) => {
        if (!selectedTags.find((item) => item.name.toLowerCase() === tag.name.toLowerCase())) {
            selectedTags = [...selectedTags, tag];
            if (sendRequest) {
                await getItemsRequest();
            }
            isSaveDisabled = false;
            dispatch('select');
        }
        menuOpen = true;
    };

    const getItemsRequest = async () => {
        try {
            const { data } = await axios.post(`/api/tags?query=${query}`, {
                excludedNames: selectedTags.map((tag) => tag.name),
            });
            tags = data.tags;
        } catch (e) {
            showToast($t('toast.tags.get.error'), 'error');
        }
    };

    const updateRequest = async () => {
        try {
            await axios.post(`/api/file/${id}/tags`, {
                tags: selectedTags.map((tag) => tag.name),
            });
            isSaveDisabled = true;
            showToast($t('toast.file.tags.success'));
        } catch (e) {
            showToast($t('toast.file.tags.error'), 'error');
        }
    };
</script>

<div class="flex gap-3 flex-wrap items-center">
    {#each selectedTags as tag}
        <SelectedTag {tag} on:delete={() => handleDeleteTag(tag)} />
    {/each}
    {#if update && !isSaveDisabled}
        <IconButton size="50" bind:disabled={isSaveDisabled} icon="save" on:click={updateRequest} />
    {/if}
</div>

<div class="relative inline-block w-full" on:focusin={() => (menuOpen = true)} on:focusout={handleFocusOut}>
    <Search label={$t('upload.search-tags')} bind:search={query} on:search={handleSearch} minChars={0} />

    <div
        id="myDropdown"
        class="min-w-64 max-h-96 hidden absolute border border-gray-300 overflow-y-scroll"
        class:block={menuOpen}
        class:hidden={!menuOpen}
    >
        <ul>
            {#if query.length}
                {#each filteredTags as tag}
                    <TagItem {tag} on:select={(event) => selectItem(event.detail)} />
                {/each}
            {:else}
                {#each tags as tag}
                    <TagItem {tag} on:select={(event) => selectItem(event.detail)} />
                {/each}
            {/if}
        </ul>
    </div>
</div>
