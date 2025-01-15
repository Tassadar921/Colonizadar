import iconv from 'iconv-lite';
import { inject } from '@adonisjs/core';

@inject()
export default class SanitizerService {
    private encoding: string = 'utf8';

    public sanitize(input: string | undefined | null): string {
        if (!input) {
            return '';
        }
        const buffer: Buffer = iconv.encode(input, this.encoding, {
            addBOM: false,
        });

        return iconv.decode(buffer, this.encoding);
    }
}
