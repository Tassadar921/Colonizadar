import {type Writable, writable} from 'svelte/store';
import { navigate as svelteNavigate } from 'svelte-routing';

export const location: Writable<string> = writable(window.location.pathname);

export function navigate(path: string, options = {}): void {
    const currentLanguage: string | null = localStorage.getItem('language');
    const normalizedPath: string = path.startsWith(`/${currentLanguage}`) ? path : `/${currentLanguage}${path}`;
    location.set(normalizedPath);
    svelteNavigate(normalizedPath, options);
}

window.addEventListener('popstate', (): void => {
    location.set(window.location.pathname);
});
