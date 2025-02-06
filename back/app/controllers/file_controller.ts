import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import UserRepository from '#repositories/user_repository';
import User from '#models/user';
import BotRepository from "#repositories/bot_repository";
import Bot from "#models/bot";

@inject()
export default class FileController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly botRepository: BotRepository,
    ) {}

    public async serveStaticProfilePictureFile({ request, response }: HttpContext): Promise<void> {
        const { userId } = request.params();

        const user: User | null = await this.userRepository.findOneBy({ frontId: userId });
        if (!user) {
            return response.notFound({ error: 'User not found' });
        }

        await user.load('profilePicture');
        if (!user.profilePicture) {
            return response.notFound({ error: "User's profile picture not found" });
        }

        return response.download(app.makePath(user.profilePicture.path));
    }

    public async serveStaticBotPictureFile({ request, response }: HttpContext): Promise<void> {
        const { botId } = request.params();

        const bot: Bot | null = await this.botRepository.findOneBy({ frontId: botId });
        if (!bot) {
            return response.notFound({ error: 'Bot not found' });
        }

        await bot.load('picture');
        if (!bot.picture) {
            return response.notFound({ error: "Bot's picture not found" });
        }

        return response.download(app.makePath(bot.picture.path));
    }
}
