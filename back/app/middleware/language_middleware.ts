import { HttpContext, Request } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import RequestLanguagesEnum from '#types/enum/request_languages_enum';
import Language from '#models/language';
import LanguageRepository from '#repositories/language_repository';

@inject()
export default class LanguageMiddleware {
    constructor(private readonly languageRepository: LanguageRepository) {}

    public async handle(ctx: HttpContext, next: () => Promise<void>): Promise<void> {
        const { request } = ctx;

        ctx.language = await this.getLanguage(request);

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

    private async getLanguage(request: Request): Promise<Language> {
        const languageCode: string = <RequestLanguagesEnum>Object.keys(RequestLanguagesEnum).find((key: string): boolean => key === request.qs().language?.toUpperCase());

        let language: Language | null;

        if (languageCode) {
            language = await this.languageRepository.findOneBy({
                code: languageCode.toLowerCase(),
            });
        } else {
            language = await this.languageRepository.findOneBy({
                code: this.getLanguageCode(request).toLowerCase(),
            });
        }

        if (!language) {
            throw new Error('Language not found');
        }

        return language;
    }
}
