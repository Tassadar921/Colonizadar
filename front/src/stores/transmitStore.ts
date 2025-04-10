import { writable } from 'svelte/store';
import { Transmit } from '@adonisjs/transmit-client';

export const transmit = writable(new Transmit({ baseUrl: process.env.VITE_API_BASE_URL }));
