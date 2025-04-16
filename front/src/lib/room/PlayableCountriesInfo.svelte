<script lang="ts">
    import type SerializedPlayableCountry from 'colonizadar-backend/app/types/serialized/serialized_playable_country';
    import { cubicOut } from 'svelte/easing';
    import { fly, fade } from 'svelte/transition';
    import Subtitle from '../shared/Subtitle.svelte';
    import Button from '../shared/Button.svelte';
    import ChevronRight from '../icons/ChevronRight.svelte';
    import ChevronLeft from '../icons/ChevronLeft.svelte';
    import { t } from 'svelte-i18n';

    export let playableCountries: SerializedPlayableCountry[] = [];

    let currentIndex = 0;
    let direction = 1;

    const next = (): void => {
        direction = -1;
        currentIndex = (currentIndex + 1) % playableCountries.length;
    };

    const prev = (): void => {
        direction = 1;
        currentIndex = (currentIndex - 1 + playableCountries.length) % playableCountries.length;
    };

    const flyFade = (node: Element, params: { x?: number; duration?: number } = {}) => {
        const defaultDuration = 250;
        const x = params.x ?? 100;
        const duration = params.duration ?? defaultDuration;

        const flyParams = {
            x,
            duration,
            easing: cubicOut,
        };

        const fadeParams = {
            duration,
            easing: cubicOut,
        };

        return {
            delay: 0,
            duration,
            css: (t: number, u: number) => {
                const flyStyle = fly(node, flyParams).css?.(t, u) || '';
                const fadeStyle = fade(node, fadeParams).css?.(t, u) || '';
                return `${flyStyle}; ${fadeStyle};`;
            },
        };
    }
</script>

{#if playableCountries.length}
    <div class="w-full max-w-xl mx-auto">
        <div class="relative min-h-[180px] overflow-hidden flex">
            <div class="flex items-center justify-between w-full">
                <Button ariaLabel="Previous country" customStyle className="p-4 text-primary-500 hover:text-primary-700 hover:scale-110 transition-all duration-300 z-50" on:click={prev}>
                    <ChevronLeft size={60} />
                </Button>

                <Button ariaLabel="Previous country" customStyle className="p-4 text-primary-500 hover:text-primary-700 hover:scale-110 transition-all duration-300 z-50" on:click={next}>
                    <ChevronRight size={60} />
                </Button>

                {#key currentIndex}
                    <div class="absolute inset-0 rounded-2xl shadow-lg transition-all duration-300 flex flex-col gap-10" in:flyFade={{ x: 100 * direction }} out:flyFade={{ x: -100 * direction }}>
                        <div class="absolute inset-0 flex justify-center items-center mt-10">
                            <img
                                class="w-1/3 object-cover opacity-20"
                                src={`${import.meta.env.VITE_API_BASE_URL}/api/static/country-flag/${playableCountries[currentIndex].id}?token=${localStorage.getItem('apiToken')}`}
                                alt="Country Flag"
                            />
                        </div>

                        <Subtitle className="text-2xl font-bold mb-2 text-center text-white">{playableCountries[currentIndex].name}</Subtitle>

                        <div class="flex gap-10 text-sm justify-center text-white z-10">
                            <div>
                                <h3 class="font-semibold">{$t('common.infantry')}</h3>
                                <p>Attack: {playableCountries[currentIndex].infantryAttack / 100}</p>
                                <p>Defense: {playableCountries[currentIndex].infantryDefense / 100}</p>
                                <p>Price: {playableCountries[currentIndex].infantryPrice * 1000}</p>
                            </div>
                            <div>
                                <h3 class="font-semibold">{$t('common.landing')}</h3>
                                <p>Attack: {playableCountries[currentIndex].landingAttack / 100}</p>
                                <p>Defense: {playableCountries[currentIndex].landingDefense / 100}</p>
                            </div>
                            <div>
                                <h3 class="font-semibold">{$t('common.ships')}</h3>
                                <p>Attack: {playableCountries[currentIndex].shipAttack / 100}</p>
                                <p>Defense: {playableCountries[currentIndex].shipDefense / 100}</p>
                                <p>Price: {playableCountries[currentIndex].shipPrice * 1000}</p>
                            </div>
                        </div>
                    </div>
                {/key}
            </div>
        </div>
    </div>
{:else}
    <p class="text-center text-gray-500 mt-8">No playable countries available.</p>
{/if}
