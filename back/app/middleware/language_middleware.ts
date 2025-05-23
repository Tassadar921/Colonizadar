import { HttpContext, Request } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import RequestLanguagesEnum from '#types/enum/request_languages_enum';
import LanguageRepository from '#repositories/language_repository';
import type { NextFn } from '@adonisjs/core/types/http';

@inject()
export default class LanguageMiddleware {
    constructor(private readonly languageRepository: LanguageRepository) {}

    public async handle(ctx: HttpContext, next: NextFn): Promise<void> {
        ctx.language = await this.languageRepository.firstOrFail({
            code: this.getLanguageCode(ctx.request).toLowerCase(),
        });

        await next();
    }

    private getLanguageCode(request: Request): RequestLanguagesEnum {
        try {
            return <RequestLanguagesEnum>(
                Object.keys(RequestLanguagesEnum).find((key: string): boolean => key === (request.headers()['accept-language']?.split(',')[0]?.split('-')[0] ?? RequestLanguagesEnum.EN).toUpperCase())
            );
        } catch (e) {
            return RequestLanguagesEnum.EN;
        }
    }
}
