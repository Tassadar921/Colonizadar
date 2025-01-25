import { HttpContext } from '@adonisjs/core/http';
import UserRepository from '#repositories/user_repository';
import ResetPasswordRepository from '#repositories/reset_password_repository';
import BrevoMailService from '#services/brevo_mail_service';
import User from '#models/user';
import ResetPassword from '#models/reset_password';
import crypto from 'crypto';
import { DateTime } from 'luxon';
import { inject } from '@adonisjs/core';
import File from '#models/file';
import app from '@adonisjs/core/services/app';
import { cuid } from '@adonisjs/core/helpers';
import FileService from '#services/file_service';
import SlugifyService from '#services/slugify_service';
import { resetPasswordValidator, sendResetPasswordEmailValidator, updateProfileValidator } from '#validators/profile';

@inject()
export default class ProfileController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly resetPasswordRepository: ResetPasswordRepository,
        private readonly mailService: BrevoMailService,
        private readonly fileService: FileService,
        private readonly slugifyService: SlugifyService
    ) {}

    public async getProfile({ response, user }: HttpContext): Promise<void> {
        await user.load('profilePicture');
        return response.send({ user: user.apiSerialize() });
    }

    public async sendResetPasswordEmail({ request, response }: HttpContext): Promise<void> {
        const { email, frontUri } = await sendResetPasswordEmailValidator.validate(request.all());

        const user: User | null = await this.userRepository.findOneBy({
            email,
        });
        if (!user) {
            return response.badRequest({ error: 'User not found' });
        }

        const previousResetPassword: ResetPassword | null = await this.resetPasswordRepository.findOneBy({ userId: user.id });
        if (previousResetPassword) {
            if (previousResetPassword.createdAt && previousResetPassword.createdAt > DateTime.now().minus({ minutes: 5 })) {
                return response.send({ success: true });
            } else {
                await previousResetPassword.delete();
            }
        }
        let token: string = '';
        let resetPassword: ResetPassword | null = null;
        do {
            token = crypto.randomBytes(32).toString('hex');
            resetPassword = await this.resetPasswordRepository.findOneBy({
                token,
            });
        } while (resetPassword);
        await ResetPassword.create({
            userId: user.id,
            token,
        });
        try {
            await this.mailService.sendResetPasswordEmail(user, `${frontUri}/${token}`);
        } catch (error) {
            response.notFound({ error: 'Error while sending email' });
        }

        return response.send({ success: true });
    }

    public async resetPassword({ request, response }: HttpContext): Promise<void> {
        const { password } = await resetPasswordValidator.validate(request.all());
        const { token } = request.params();

        const resetPassword: ResetPassword | null = await this.resetPasswordRepository.findOneBy({
            token,
        });
        if (!resetPassword) {
            return response.notFound({ error: 'Token not found' });
        }

        const user: User | null = await this.userRepository.find(resetPassword.userId);
        if (!user) {
            return response.notFound({ error: 'User not found' });
        }

        await resetPassword.delete();

        user.password = password;
        await user.save();

        return response.send({ success: true });
    }

    public async updateProfile({ request, response, user }: HttpContext): Promise<void> {
        const { username, profilePicture } = await updateProfileValidator.validate(request.all());

        user.username = username;
        await user.load('profilePicture');

        if (profilePicture && profilePicture.isValid && profilePicture.tmpPath) {
            if (user.fileId) {
                user.fileId = null;
                await user.save();
                this.fileService.delete(user.profilePicture);
                await user.profilePicture.delete();
            }
            profilePicture.clientName = `${cuid()}-${this.slugifyService.slugify(profilePicture.clientName)}`;
            const path = `static/profile-picture`;
            await profilePicture.move(app.makePath(path));
            const file: File = await File.create({
                name: profilePicture.clientName,
                path: `${path}/${profilePicture.clientName}`,
                extension: profilePicture.extname,
                mimeType: `${profilePicture.type}/${profilePicture.subtype}`,
                size: profilePicture.size,
            });
            await file.refresh();
            user.fileId = file.id;
        }

        await user.save();
        await user.refresh();

        return response.send({ user: user.apiSerialize() });
    }
}
