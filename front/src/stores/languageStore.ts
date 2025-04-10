import { writable } from 'svelte/store';

export const language = writable('en');

export function setLanguage(value) {
    localStorage.setItem('language', value);
    language.set(value);
}
