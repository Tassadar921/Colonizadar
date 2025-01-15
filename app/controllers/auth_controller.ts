import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';
import UserRepository from '#repositories/user_repository';
import RegexService from '#services/regex_service';
import FrontClientRepository from '#repositories/front_client_repository';
import FrontClient from '#models/front_client';
import RoleEnum from '#types/enum/role_enum';
import BrevoMailService from '#services/brevo_mail_service';
import crypto from 'crypto';
import { DateTime } from 'luxon';
import { loginValidator, sendAccountCreationEmailValidator } from '#validators/auth';

@inject()
export default class AuthController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly frontClientRepository: FrontClientRepository,
        private readonly mailService: BrevoMailService,
        private readonly regexService: RegexService
    ) {}

    public async login({ request, response }: HttpContext): Promise<void> {
        try {
            const { email, password } = await loginValidator.validate(request.all());

            const user: User = await User.verifyCredentials(email, password);
            await user.load('profilePicture');

            const token: AccessToken = await User.accessTokens.create(user);

            return response.send({ message: 'Logged in', token, user: await user.apiSerialize() });
        } catch (e) {
            return response.unauthorized({ error: 'API Login failed' });
        }
    }

    public async logout({ auth, response }: HttpContext): Promise<void> {
        const user: User = await auth.use('web').authenticate();
        return response.send({ revoked: true });
    }

    public async sendAccountCreationEmail({ request, response }: HttpContext): Promise<void> {
        const { username, email, password, frontClient, frontUri, consent } = await sendAccountCreationEmailValidator.validate(request.all());

        if (!this.regexService.isValidPassword(password)) {
            return response.badRequest({
                error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character',
            });
        } else if (!consent) {
            return response.badRequest({ error: 'Content is required' });
        }

        const frontClientModel: FrontClient | null = await this.frontClientRepository.findOneBy({ name: frontClient, enabled: true });
        if (!frontClientModel) {
            return response.notFound({ error: 'Front client not found' });
        }

        let user: User | null = await this.userRepository.findOneBy({ email });
        if (user) {
            if (!user.enabled) {
                if (user.createdAt && user.createdAt > DateTime.now().minus({ minutes: 5 })) {
                    return response.send({ success: true });
                } else {
                    await user.delete();
                }
            } else {
                return response.status(409).send({ error: 'User already exists' });
            }
        }

        try {
            const token: string = crypto.randomBytes(32).toString('hex');
            await this.mailService.sendAccountCreationEmail(email, `${frontUri}/${token}`);
            await User.create({
                username,
                email,
                password,
                role: RoleEnum.USER,
                creationToken: token,
                acceptedTermsAndConditions: true,
            });
        } catch (error) {
            return response.status(error.status).send({ error: error.message });
        }

        return response.send({ message: 'Check your mails to confirm account creation' });
    }

    public async confirmAccountCreation({ request, response, language }: HttpContext): Promise<void> {
        const { token } = request.params();

        const user: User | null = await this.userRepository.findOneBy({ creationToken: token });
        if (!user) {
            return response.badRequest({ error: 'User not found' });
        }

        user.enabled = true;
        user.creationToken = null;
        await user.save();

        const accessToken: AccessToken = await User.accessTokens.create(user);

        return response.send({ message: 'User successfully enabled', token: accessToken, user: await user.apiSerialize(language) });
    }
}
