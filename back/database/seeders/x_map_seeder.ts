import { BaseSeeder } from '@adonisjs/lucid/seeders';
import env from '#start/env';
import User from '#models/user';
import UserRepository from '#repositories/user_repository';
import UserRoleEnum from '#types/enum/user_role_enum';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const userRepository: UserRepository = new UserRepository();
    }
}
