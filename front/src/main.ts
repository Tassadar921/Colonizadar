import './app.css';
import { init, register, locale } from 'svelte-i18n';
import App from './App.svelte';
import { mount } from "svelte";

const language: string | null = localStorage.getItem('language');
if (language !== 'en' && language !== 'fr') {
    localStorage.setItem('language', 'en');
}

register('en', () => import('./locales/en.json'));
register('fr', () => import('./locales/fr.json'));

init({
    fallbackLocale: 'en',
    initialLocale: localStorage.getItem('language'),
});

locale.set(localStorage.getItem('language'));

const app = mount(App, {
    target: document.getElementById('app')!,
});

export default app;
