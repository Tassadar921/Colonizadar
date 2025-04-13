import App from './App.svelte';
import './app.css';
import { initLanguages } from './i18n';
import { mount } from 'svelte';

await initLanguages();

const app = mount(App, { target: document.getElementById('app')! });

export default app;
