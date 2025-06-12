import { type Writable, writable } from 'svelte/store';
import { Transmit } from '@adonisjs/transmit-client';

const baseUrl: string = import.meta.env.VITE_API_BASE_URI;

if (!baseUrl) {
    throw new Error('VITE_API_BASE_URI is not defined');
}

export const transmit: Writable<Transmit> = writable(new Transmit({ baseUrl }));
