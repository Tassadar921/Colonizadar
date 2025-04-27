import { BaseSeeder } from '@adonisjs/lucid/seeders';
import User from '#models/user';
import UserRepository from '#repositories/user_repository';
import Map from '#models/map';
import MapRepository from '#repositories/map_repository';
import app from '@adonisjs/core/services/app';
import File from '#models/file';
import FileService from '#services/file_service';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const userRepository: UserRepository = new UserRepository();
        const mapRepository: MapRepository = new MapRepository();
        const fileService: FileService = new FileService();

        const maps: { name: string; createdByEmail: string; neutralFlagName: string }[] = [{ name: 'World Map', createdByEmail: 'paul.lecuisinier@gmail.com', neutralFlagName: 'white.svg' }];

        for (const map of maps) {
            if (!(await mapRepository.findOneBy({ name: map.name }))) {
                const createdBy: User | null = await userRepository.firstOrFail({ email: map.createdByEmail });

                const path: string = `static/map/neutral/${map.neutralFlagName}`;
                const { size, mimeType, extension, name } = await fileService.getFileInfo(app.makePath(path));
                const flag: File = await File.create({
                    name,
                    path,
                    extension,
                    mimeType,
                    size,
                });
                await flag.refresh();

                await Map.create({
                    name: map.name,
                    createdById: createdBy.id,
                    neutralFlagId: flag.id,
                    mainSeason: 1,
                    startingPlayersGold: 10000,
                    wildInfantryCostFactor: 0.01,
                    wildInfantryDefenseFactor: 0.02,
                    wildLandingDefenseFactor: 0.25,
                    baseInfantryCost: 0.01,
                    baseShipCost: 0.000002,
                    spyTerritoryCost: 200,
                    spyPlayerCost: 500,
                    financePlayerCostFactor: 0.9,
                    financeWildTerritoryCostFactor: 0.9,
                    subversionCostFactor: 0.9,
                    financeWildTerritoryEnforcementFactor: 2,
                    wildTerritorySubversionFactor: 0.5,
                });
                console.log(`Map ${map.name} created`);
            }
        }
    }
}
