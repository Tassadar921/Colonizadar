import App from './App.svelte';
import './app.css';
import { initI148nLanguages } from './i18n';
import { mount } from 'svelte';
import axios from 'axios';
import { setLanguage } from './stores/languageStore';
import { locale } from 'svelte-i18n';
import { navigate } from './stores/locationStore';
import { updateProfile } from './stores/profileStore';
import { showToast } from './services/toastService';
import { get } from 'svelte/store';
import { location } from './stores/locationStore';
import { t } from 'svelte-i18n';

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

const logInformations = async (token: string): Promise<void> => {
    const tokenExpiresAt: string | null = localStorage.getItem('apiTokenExpiration');
    if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) {
        localStorage.removeItem('apiToken');
        localStorage.removeItem('apiTokenExpiration');
        showToast(get(t)('toast.token.expired'), 'warning');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        await axios.get('/api');
        await updateProfile();
    } catch (error: any) {
        if (error.response.data.errors) {
            error.response.data.errors.forEach((error: any): void => {
                showToast(error.message, 'error');
            });
        } else {
            showToast(error.response.data.error, 'error');
        }
        localStorage.removeItem('apiToken');
        localStorage.removeItem('apiTokenExpiration');
        axios.defaults.headers.common['Authorization'] = '';
    }
};

// Axios configuration
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

// Language configuration
initializeLanguage();

// I18n configuration
await initI148nLanguages();

// Theme configuration
const theme: string | null = localStorage.getItem('theme');
if (theme !== 'light' && theme !== 'dark') {
    localStorage.setItem('theme', 'light');
}

// Session token configuration
const token: string | null = localStorage.getItem('apiToken');
if (token) {
    await logInformations(token);
}

const app = mount(App, { target: document.getElementById('app')! });

export default app;
