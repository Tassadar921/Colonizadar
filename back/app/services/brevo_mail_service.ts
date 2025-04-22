import axios from 'axios';
import env from '#start/env';
import User from '#models/user';

export default class BrevoMailService {
    private apiUrl: string = 'https://api.brevo.com/v3/smtp/email';

    private sender: object = {
        name: 'Colonizadar',
        email: env.get('ACCOUNT_SENDER_EMAIL'),
    }

    private headers: object = {
        'Api-Key': `${env.get('BREVO_API_KEY')}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    public async sendResetPasswordEmail(user: User, uri: string): Promise<void> {
        await axios.post(
            this.apiUrl,
            {
                sender: this.sender,
                to: [
                    {
                        name: 'Colonizadar User',
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
                headers: this.headers
            }
        );
    }

    public async sendAccountCreationEmail(email: string, uri: string): Promise<void> {
        await axios.post(
            this.apiUrl,
            {
                sender: this.sender,
                to: [
                    {
                        name: 'Colonizadar User',
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
                headers: this.headers
            }
        );
    }
}
