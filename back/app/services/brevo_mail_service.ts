import axios from 'axios';
import env from '#start/env';
import User from '#models/user';

export default class BrevoMailService {
    private apiUrl: string = 'https://api.brevo.com/v3/smtp/email';

    private sender: object = {
        name: 'Colonizadar',
        email: env.get('ACCOUNT_SENDER_EMAIL'),
    };

    private readonly replyTo: object = {
        email: env.get('ACCOUNT_SENDER_EMAIL'),
        name: 'Colonizadar Support',
    };

    private headers: object = {
        'Api-Key': `${env.get('BREVO_API_KEY')}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    /**
     * Sends a password reset email to a user with a given URI for resetting.
     *
     * @param {User} user - The user object containing the email to send to.
     * @param {string} uri - The URI link included in the reset password email.
     * @returns {Promise<void>} Resolves when the email has been sent.
     */
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
                replyTo: this.replyTo,
                templateId: 7,
                subject: 'Reset your password',
                params: {
                    uri,
                },
            },
            {
                headers: this.headers,
            }
        );
    }

    /**
     * Sends an account creation email to a specified email address with a given URI.
     *
     * @param {string} email - The recipient's email address.
     * @param {string} uri - The URI link included in the account creation email.
     * @returns {Promise<void>} Resolves when the email has been sent.
     */
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
                replyTo: this.replyTo,
                templateId: 2,
                subject: 'Account creation',
                params: {
                    uri,
                },
            },
            {
                headers: this.headers,
            }
        );
    }
}
