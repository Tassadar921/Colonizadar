import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import UserRepository from '#repositories/user_repository';
import User from '#models/user';

@inject()
export default class FileController {
    constructor(private readonly userRepository: UserRepository) {}

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
}
