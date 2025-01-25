import { writable } from 'svelte/store';
import { navigate as svelteNavigate } from 'svelte-routing';

export const location = writable(window.location.pathname);

export function navigate(path, options = {}) {
    const currentLanguage = localStorage.getItem('language');
    const normalizedPath = path.startsWith(`/${currentLanguage}`) ? path : `/${currentLanguage}${path}`;
    location.set(normalizedPath);
    svelteNavigate(normalizedPath, options);
}

window.addEventListener('popstate', () => {
    location.set(window.location.pathname);
});
