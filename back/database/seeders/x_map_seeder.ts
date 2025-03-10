import { BaseSeeder } from '@adonisjs/lucid/seeders';
import User from '#models/user';
import UserRepository from '#repositories/user_repository';
import Map from '#models/map';
import MapRepository from '#repositories/map_repository';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const userRepository: UserRepository = new UserRepository();
        const mapRepository: MapRepository = new MapRepository();

        const maps: { name: string; createdByEmail: string }[] = [{ name: 'World Map', createdByEmail: 'paul.lecuisinier@gmail.com' }];

        for (const map of maps) {
            if (!(await mapRepository.findOneBy({ name: map.name }))) {
                const createdBy: User | null = await userRepository.findOneBy({ email: map.createdByEmail });
                if (!createdBy) {
                    console.error(`User ${map.createdByEmail} not found`);
                    continue;
                }

                await Map.create({
                    name: map.name,
                    createdById: createdBy.id,
                });
                console.log(`Map ${map.name} created`);
            }
        }
    }
}
