import {addMessages, init, locale} from "svelte-i18n";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

export async function initLanguages(): Promise<void> {
    const defaultLang = 'en';
    const supportedLanguages = ['en', 'fr'];
    let userLang = localStorage.getItem('language');

    if (!userLang || !supportedLanguages.includes(userLang)) {
        userLang = defaultLang;
        localStorage.setItem('language', defaultLang);
    }

    addMessages('en', en);
    addMessages('fr', fr);

    init({
        fallbackLocale: defaultLang,
        initialLocale: userLang,
    });

    locale.set(userLang);
}
