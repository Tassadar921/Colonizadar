import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import UserRepository from '#repositories/user_repository';
import User from '#models/user';
import BotRepository from '#repositories/bot_repository';
import Bot from '#models/bot';
import PlayableCountry from "#models/playable_country";
import PlayableCountryRepository from "#repositories/playable_country_repository";
import {
    serveStaticBotPictureFileValidator,
    serveStaticCountryFlagFileValidator,
    serveStaticProfilePictureFileValidator
} from "#validators/file";

@inject()
export default class FileController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly botRepository: BotRepository,
        private readonly playableCountryRepository: PlayableCountryRepository
    ) {}

    public async serveStaticProfilePictureFile({ request, response }: HttpContext): Promise<void> {
        const { userId } = await serveStaticProfilePictureFileValidator.validate(request.params());

        const user: User | null = await this.userRepository.findOneBy({ frontId: userId });
        if (!user) {
            return response.notFound({ error: 'User not found' });
        }

        if (!user.profilePictureId) {
            return response.notFound({ error: "User's profile picture not found" });
        }

        await user.load('profilePicture');
        return response.download(app.makePath(user.profilePicture.path));
    }

    public async serveStaticBotPictureFile({ request, response }: HttpContext): Promise<void> {
        const { botId } = await serveStaticBotPictureFileValidator.validate(request.params());

        const bot: Bot | null = await this.botRepository.findOneBy({ frontId: botId });
        if (!bot) {
            return response.notFound({ error: 'Bot not found' });
        }

        if (!bot.pictureId) {
            return response.notFound({ error: "Bot's picture not found" });
        }

        await bot.load('picture');
        return response.download(app.makePath(bot.picture.path));
    }

    public async serveStaticCountryFlagFile({ request, response }: HttpContext): Promise<void> {
        const { countryId } = await serveStaticCountryFlagFileValidator.validate(request.params());

        const country: PlayableCountry | null = await this.playableCountryRepository.findOneBy({ frontId: countryId });
        if (!country) {
            return response.notFound({ error: 'Country not found' });
        }

        if (!country.flagId) {
            return response.notFound({ error: "Country flag not found" });
        }

        await country.load('flag');
        return response.download(app.makePath(country.flag.path));
    }
}
