import { HttpContext } from '@adonisjs/core/http';
import { GithubDriver } from '@adonisjs/ally/drivers/github';
import { DiscordDriver } from '@adonisjs/ally/drivers/discord';
import { GoogleDriver } from '@adonisjs/ally/drivers/google';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import FileService from '#services/file_service';
import { inject } from '@adonisjs/core';
import app from '@adonisjs/core/services/app';
import File from '#models/file';
import User from '#models/user';
import UserRoleEnum from '#types/enum/user_role_enum';
import env from '#start/env';
import UserRepository from '#repositories/user_repository';
import { I18n } from '@adonisjs/i18n';

@inject()
export default class OauthController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly fileService: FileService
    ) {}

    public async github({ ally }: HttpContext): Promise<void> {
        return ally.use('github').redirect();
    }

    public async githubCallback({ ally, response, i18n }: HttpContext): Promise<void> {
        const client: GithubDriver = ally.use('github');
        const handleResponse: { error?: string; token?: { token: string; expiresAt: Date } } = await this.handleCallback(client, i18n);
        if (handleResponse.error) {
            return response.badRequest({ error: handleResponse.error });
        }

        return response.redirect(`${env.get('FRONT_URI')}/en/oauth/${handleResponse.token!.token}?apiTokenExpiration=${handleResponse.token!.expiresAt}`);
    }

    public async discord({ ally }: HttpContext): Promise<void> {
        return ally.use('discord').redirect();
    }

    public async discordCallback({ ally, response, i18n }: HttpContext): Promise<void> {
        const client: DiscordDriver = ally.use('discord');
        const handleResponse: { error?: string; token?: { token: string; expiresAt: Date } } = await this.handleCallback(client, i18n);
        if (handleResponse.error) {
            return response.badRequest({ error: handleResponse.error });
        }

        return response.redirect(`${env.get('FRONT_URI')}/en/oauth/${handleResponse.token!.token}?apiTokenExpiration=${handleResponse.token!.expiresAt}`);
    }

    public async google({ ally }: HttpContext): Promise<void> {
        return ally.use('google').redirect();
    }

    public async googleCallback({ ally, response, i18n }: HttpContext): Promise<void> {
        const client: GoogleDriver = ally.use('google');
        const handleResponse: { error?: string; token?: { token: string; expiresAt: Date } } = await this.handleCallback(client, i18n);
        if (handleResponse.error) {
            return response.badRequest({ error: handleResponse.error });
        }

        return response.redirect(`${env.get('FRONT_URI')}/en/oauth/${handleResponse.token!.token}?apiTokenExpiration=${handleResponse.token!.expiresAt}`);
    }

    private async handleCallback(client: GithubDriver | DiscordDriver | GoogleDriver, i18n: I18n): Promise<{ error?: string; token?: { token: string; expiresAt: Date } }> {
        /**
         * User has denied access by canceling
         * the login flow
         */
        if (client.accessDenied()) {
            return { error: i18n.t('messages.oauth.callback.error.access-denied') };
        }

        /**
         * OAuth state verification failed. This happens when the
         * CSRF cookie gets expired.
         */
        if (client.stateMisMatch()) {
            return { error: i18n.t('messages.oauth.callback.error.state-mismatch') };
        }

        /**
         * Client responded with some error
         */
        if (client.hasError()) {
            return { error: client.getError() ?? i18n.t('messages.oauth.callback.error.default') };
        }

        const oauthUser = await client.user();
        let user: User | null = await this.userRepository.findOneBy({ email: oauthUser.email });
        if (user) {
            if (!user.isOauth) {
                user.isOauth = true;
                await user.save();
            }
            const accessToken: AccessToken = await User.accessTokens.create(user);
            const { token, expiresAt } = accessToken.toJSON();
            return { token: { token: token!, expiresAt: expiresAt! } };
        }

        const profilePicturePath: string = await this.fileService.saveOauthProfilePictureFromUrl(oauthUser.avatarUrl);
        const { size, mimeType, extension, name } = await this.fileService.getFileInfo(app.makePath(profilePicturePath));

        const profilePicture: File | null = await File.create({
            name,
            path: profilePicturePath,
            extension,
            mimeType,
            size,
        });
        await profilePicture.refresh();

        user = await User.create({
            username: oauthUser.nickName,
            email: oauthUser.email,
            isOauth: true,
            profilePictureId: profilePicture.id,
            enabled: true,
            acceptedTermsAndConditions: true,
            role: UserRoleEnum.USER,
        });

        const accessToken: AccessToken = await User.accessTokens.create(user);
        const { token, expiresAt } = accessToken.toJSON();
        return { token: { token: token!, expiresAt: expiresAt! } };
    }
}
