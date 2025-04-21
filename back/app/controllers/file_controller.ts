import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import UserRepository from '#repositories/user_repository';
import User from '#models/user';
import BotRepository from '#repositories/bot_repository';
import Bot from '#models/bot';
import PlayableCountry from '#models/playable_country';
import PlayableCountryRepository from '#repositories/playable_country_repository';
import Map from '#models/map';
import { serveStaticBotPictureFileValidator, serveStaticCountryFlagFileValidator, serveStaticNeutralCountryFlagFileValidator, serveStaticProfilePictureFileValidator } from '#validators/file';
import MapRepository from '#repositories/map_repository';
import cache from '@adonisjs/cache/services/main';

@inject()
export default class FileController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly botRepository: BotRepository,
        private readonly playableCountryRepository: PlayableCountryRepository,
        private readonly mapRepository: MapRepository
    ) {}

    public async serveStaticProfilePictureFile({ request, response }: HttpContext): Promise<void> {
        const { userId } = await serveStaticProfilePictureFileValidator.validate(request.params());

        try {
            const filePath: string = await cache.getOrSet({
                key: `user-profile-picture:${userId}`,
                ttl: '1h',
                factory: async (): Promise<string> => {
                    const otherUser: User = await this.userRepository.firstOrFail({ frontId: userId }, ['profilePicture']);

                    if (!otherUser.profilePicture) {
                        throw new Error('NO_PICTURE');
                    }

                    return app.makePath(otherUser.profilePicture.path);
                },
            });

            return response.download(filePath);
        } catch (error: any) {
            if (error.message === 'NO_PICTURE') {
                return response.notFound({ error: "User's profile picture not found" });
            }

            throw error;
        }
    }

    public async serveStaticBotPictureFile({ request, response }: HttpContext): Promise<void> {
        const { botId } = await serveStaticBotPictureFileValidator.validate(request.params());

        try {
            const filePath: string = await cache.getOrSet({
                key: `bot-picture:${botId}`,
                ttl: '24h',
                factory: async (): Promise<string> => {
                    const bot: Bot = await this.botRepository.firstOrFail({ frontId: botId }, ['picture']);

                    if (!bot.picture) {
                        throw new Error('NO_PICTURE');
                    }

                    return app.makePath(bot.picture.path);
                },
            });

            return response.download(filePath);
        } catch (error: any) {
            if (error.message === 'NO_PICTURE') {
                return response.notFound({ error: "Bot's picture not found" });
            }

            throw error;
        }
    }

    public async serveStaticCountryFlagFile({ request, response }: HttpContext): Promise<void> {
        const { countryId } = await serveStaticCountryFlagFileValidator.validate(request.params());

        try {
            const filePath: string = await cache.getOrSet({
                key: `country-flag:${countryId}`,
                ttl: '24h',
                factory: async (): Promise<string> => {
                    const country: PlayableCountry = await this.playableCountryRepository.firstOrFail({ frontId: countryId }, ['flag']);

                    if (!country.flag) {
                        throw new Error('NO_PICTURE');
                    }

                    return app.makePath(country.flag.path);
                },
            });

            return response.download(filePath);
        } catch (error: any) {
            if (error.message === 'NO_PICTURE') {
                return response.notFound({ error: 'Country flag not found' });
            }

            throw error;
        }
    }

    public async serveStaticNeutralCountryFlagFile({ request, response }: HttpContext): Promise<void> {
        const { mapId } = await serveStaticNeutralCountryFlagFileValidator.validate(request.params());

        try {
            const filePath: string = await cache.getOrSet({
                key: `map-neutral-flag:${mapId}`,
                ttl: '24h',
                factory: async (): Promise<string> => {
                    const map: Map = await this.mapRepository.firstOrFail({ frontId: mapId }, ['neutralFlag']);

                    if (!map.neutralFlag) {
                        throw new Error('NO_PICTURE');
                    }

                    return app.makePath(map.neutralFlag.path);
                },
            });

            return response.download(filePath);
        } catch (error: any) {
            if (error.message === 'NO_PICTURE') {
                return response.notFound({ error: 'Neutral flag not found' });
            }

            throw error;
        }
    }
}
