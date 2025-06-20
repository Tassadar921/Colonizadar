import { BaseSeeder } from '@adonisjs/lucid/seeders';
import User from '#models/user';
import UserRepository from '#repositories/user_repository';
import Map from '#models/map';
import MapRepository from '#repositories/map_repository';
import app from '@adonisjs/core/services/app';
import File from '#models/file';
import FileService from '#services/file_service';
import FileTypeEnum from '#types/enum/file_type_enum';
import { Translation } from '@stouder-io/adonis-translatable';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const userRepository: UserRepository = new UserRepository();
        const mapRepository: MapRepository = new MapRepository();
        const fileService: FileService = new FileService();

        const maps: { code: string; englishName: string; frenchName: string; createdByEmail: string; neutralFlagName: string; fortifiedIconName: string; factoryIconName: string }[] = [
            {
                code: 'wm',
                englishName: 'World Map',
                frenchName: 'Carte mondiale',
                createdByEmail: 'paul.lecuisinier@gmail.com',
                neutralFlagName: 'white.svg',
                fortifiedIconName: 'castle-tower.svg',
                factoryIconName: 'factory.svg',
            },
        ];

        for (const map of maps) {
            if (!(await mapRepository.findOneBy({ code: map.code }))) {
                const createdBy: User | null = await userRepository.firstOrFail({ email: map.createdByEmail });

                const flagPath: string = `static/map/neutral/${map.neutralFlagName}`;
                const { size: flagSize, mimeType: flagMimeType, extension: flagExtension, name: flagName } = await fileService.getFileInfo(app.makePath(flagPath));
                const neutralFlag: File = await File.create({
                    name: flagName,
                    path: flagPath,
                    extension: flagExtension,
                    mimeType: flagMimeType,
                    size: flagSize,
                    type: FileTypeEnum.NEUTRAL_FLAG,
                });
                await neutralFlag.refresh();

                const fortifiedIconPath: string = `static/map/fortified/${map.fortifiedIconName}`;
                const {
                    size: fortifiedIconSize,
                    mimeType: fortifiedIconMimeType,
                    extension: fortifiedIconExtension,
                    name: fortifiedIconName,
                } = await fileService.getFileInfo(app.makePath(fortifiedIconPath));
                const fortifiedIcon: File = await File.create({
                    name: fortifiedIconName,
                    path: fortifiedIconPath,
                    extension: fortifiedIconExtension,
                    mimeType: fortifiedIconMimeType,
                    size: fortifiedIconSize,
                    type: FileTypeEnum.FORTIFIED_ICON,
                });
                await fortifiedIcon.refresh();

                const factoryIconPath: string = `static/map/factory/${map.factoryIconName}`;
                const { size: factoryIconSize, mimeType: factoryIconMimeType, extension: factoryIconExtension, name: factoryIconName } = await fileService.getFileInfo(app.makePath(factoryIconPath));
                const factoryIcon: File = await File.create({
                    name: factoryIconName,
                    path: factoryIconPath,
                    extension: factoryIconExtension,
                    mimeType: factoryIconMimeType,
                    size: factoryIconSize,
                    type: FileTypeEnum.FACTORY_ICON,
                });
                await factoryIcon.refresh();

                await Map.create({
                    code: map.code,
                    name: Translation.from({
                        en: map.englishName,
                        fr: map.frenchName,
                    }),
                    createdById: createdBy.id,
                    neutralFlagId: neutralFlag.id,
                    fortifiedIconId: fortifiedIcon.id,
                    factoryIconId: factoryIcon.id,
                    mainSeason: 1,
                    startingPlayersGold: 10000000,
                    wildInfantryCostFactor: 0.01,
                    wildInfantryDefenseFactor: 0.15,
                    wildShipsDefenseFactor: 0.15,
                    wildLandingDefenseFactor: 0.25,
                    baseInfantryCost: 100,
                    baseShipCost: 100000,
                    spyTerritoryCost: 200000,
                    spyFortifiedTerritoryCost: 1000000,
                    spyFactoryCost: 2500000,
                    spyPlayerCost: 500000,
                    financePlayerCostFactor: 0.9,
                    financePlayerStep: 100000,
                    financeWildTerritoryStep: 50000,
                    financeWildTerritoryCostFactor: 0.9,
                    subvertCost: 50000,
                    financeWildTerritoryEnforcementFactor: 2,
                    wildTerritorySubvertFactor: 0.5,
                    fortifyCost: 2000000,
                    peaceSeasonsInterval: 12,
                });
            }
        }
    }
}
