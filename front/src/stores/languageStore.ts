import { type Writable, writable } from 'svelte/store';

export const language: Writable<string> = writable('en');

export function setLanguage(value: string): void {
    localStorage.setItem('language', value);
    language.set(value);
}
