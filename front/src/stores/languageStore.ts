import { type Writable, writable } from 'svelte/store';
import { init, register, locale } from 'svelte-i18n';

export const language: Writable<string> = writable('en');

export async function initLanguages(): Promise<void> {
    const defaultLang = 'en';
    const supportedLanguages = ['en', 'fr'];
    let userLang = localStorage.getItem('language');

    if (!userLang || !supportedLanguages.includes(userLang)) {
        userLang = defaultLang;
        localStorage.setItem('language', defaultLang);
    }

    try {
        register('en', () => import('../locales/en.json'));
        register('fr', () => import('../locales/fr.json'));
    } catch (error: any) {
        console.error('Error loading languages:', error);
    }

    init({
        fallbackLocale: defaultLang,
        initialLocale: userLang,
    });

    locale.set(userLang);
}

export function setLanguage(value: string): void {
    localStorage.setItem('language', value);
    language.set(value);
}
