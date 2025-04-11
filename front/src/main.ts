import App from './App.svelte';
import './app.css';
import { initLanguages } from './stores/languageStore';

initLanguages()
    .then((): void => {
        console.log('Languages initialized');
    })
    .catch((error: any): void => {
        console.error('Error initializing languages:', error);
    });

const app = new App({
    target: document.getElementById('app')!,
});

export default app;
