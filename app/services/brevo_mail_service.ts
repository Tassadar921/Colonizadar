import axios from 'axios';
import env from '#start/env';
import { inject } from '@adonisjs/core';
import User from '#models/user';

@inject()
export default class BrevoMailService {
    private apiUrl: string = 'https://api.brevo.com/v3/smtp/email';

    public async sendResetPasswordEmail(user: User, uri: string): Promise<void> {
        await axios.post(
            this.apiUrl,
            {
                sender: {
                    name: 'Tassadapi',
                    email: env.get('ACCOUNT_SENDER_EMAIL'),
                },
                to: [
                    {
                        name: 'Tassadapi User',
                        email: user.email,
                    },
                ],
                templateId: 7,
                subject: 'Reset your password',
                params: {
                    uri,
                },
            },
            {
                headers: {
                    'Api-Key': `${env.get('BREVO_API_KEY')}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
    }

    public async sendAccountCreationEmail(email: string, uri: string): Promise<void> {
        await axios.post(
            this.apiUrl,
            {
                sender: {
                    name: 'Tassadapi',
                    email: env.get('ACCOUNT_SENDER_EMAIL'),
                },
                to: [
                    {
                        name: 'Tassadapi User',
                        email: email,
                    },
                ],
                templateId: 2,
                subject: 'Account creation',
                params: {
                    uri,
                },
            },
            {
                headers: {
                    'Api-Key': `${env.get('BREVO_API_KEY')}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
    }
}
