import { createTuyau } from '@tuyau/client';
import { api } from 'colonizadar-backend/.adonisjs/api';

export const tuyau = createTuyau({
    baseUrl: 'http://localhost:3333',
    api,
});
