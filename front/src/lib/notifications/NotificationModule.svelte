<script>
    import Button from '../shared/Button.svelte';
    import Icon from '../shared/Icon.svelte';
    import { createEventDispatcher } from 'svelte';
    import Subtitle from '../shared/Subtitle.svelte';

    const dispatch = createEventDispatcher();

    export let title;
    export let notifications = [];
    export let noneMessage;
</script>

<div class="flex flex-col gap-5 my-5 p-5 overflow-y-scroll scrollbar-hide max-h-[400px]">
    <Subtitle>{title}</Subtitle>
    {#if notifications.length}
        <div class="flex flex-col gap-1 w-full">
            {#each notifications as notificationObject}
                <div class="flex justify-between items-center h-12 rounded-xl border border-gray-800 px-3 hover:bg-gray-800 transition-colors duration-300">
                    <div class="flex gap-5 flex-wrap items-center">
                        <p>{notificationObject.from.username}</p>
                    </div>
                    <div class="flex gap-10 pr-5">
                        <Button
                            ariaLabel="Accept as friend"
                            customStyle
                            className="transition-colors duration-300 text-green-600 hover:text-green-400"
                            on:click={() => dispatch('accept', notificationObject)}
                        >
                            <Icon name="confirm" />
                        </Button>
                        <Button
                            ariaLabel="Refuse friend request"
                            customStyle
                            className="transition-colors duration-300 text-red-600 hover:text-red-400"
                            on:click={() => dispatch('refuse', notificationObject)}
                        >
                            <Icon name="close" />
                        </Button>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p class="my-5">{noneMessage}</p>
    {/if}
</div>
