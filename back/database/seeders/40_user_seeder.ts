import { BaseSeeder } from '@adonisjs/lucid/seeders';
import env from '#start/env';
import User from '#models/user';
import UserRepository from '#repositories/user_repository';
import UserRoleEnum from '#types/enum/user_role_enum';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const userRepository: UserRepository = new UserRepository();

        const emails: string[] = JSON.parse(env.get('FRIEND_EMAILS'));
        for (const email of emails) {
            if (!(await userRepository.findOneBy({ email }))) {
                await User.create({
                    username: email.split('@')[0],
                    email,
                    password: 'xxx',
                    role: email === 'paul.lecuisinier@gmail.com' ? UserRoleEnum.ADMIN : UserRoleEnum.USER,
                    enabled: true,
                    acceptedTermsAndConditions: true,
                });
            }
        }
    }
}
