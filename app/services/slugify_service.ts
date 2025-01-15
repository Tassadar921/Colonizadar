import { inject } from '@adonisjs/core';

@inject()
export default class SlugifyService {
    public slugify(text: string): string {
        return text
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-\.]+/g, '')
            .replace(/\-\-+/g, '-');
    }
}
