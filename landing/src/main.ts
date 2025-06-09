import App from './App.svelte';
import './app.css';
import { initI148nLanguages } from './i18n';
import { mount } from 'svelte';
import axios from 'axios';
import { setLanguage } from './stores/languageStore';
import { locale } from 'svelte-i18n';
import { navigate, location } from './stores/locationStore';
import { get } from 'svelte/store';

const supportedLanguages: string[] = ['en', 'fr'];

const initializeLanguage = (): void => {
    const langRegex = new RegExp(`^\/(${supportedLanguages.join('|')})(\/|$)`);
    const langMatch: RegExpMatchArray | null = langRegex.exec(get(location));

    const initialSetLanguage = (language: string): void => {
        setLanguage(language);
        locale.set(language);
        axios.defaults.headers.common['Accept-Language'] = `${language}-${language.toUpperCase()}`;
    };

    let language: string | null = langMatch ? langMatch[1] : null;
    if (!language || !supportedLanguages.includes(language)) {
        language = 'en';
        initialSetLanguage(language);
        navigate(`/${language}`);
    } else {
        initialSetLanguage(language);
    }
};

// Axios configuration
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URI;

// Language configuration
initializeLanguage();

// I18n configuration
initI148nLanguages();

// Theme configuration
const theme: string | null = localStorage.getItem('theme');
if (theme !== 'light' && theme !== 'dark') {
    localStorage.setItem('theme', 'light');
}

const app = mount(App, { target: document.getElementById('app')! });

export default app;
