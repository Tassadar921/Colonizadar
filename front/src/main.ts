import App from './App.svelte';
import './app.css';
import {initLanguages} from "./i18n";

await initLanguages();

const app = new App({
    target: document.getElementById('app')!,
});

export default app;
