import { BaseSeeder } from '@adonisjs/lucid/seeders';
import PlayableCountryRepository from '#repositories/playable_country_repository';
import PlayableCountry from '#models/playable_country';
import app from '@adonisjs/core/services/app';
import File from '#models/file';
import FileService from '#services/file_service';
import MapRepository from '#repositories/map_repository';
import Map from '#models/map';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const playableCountryRepository: PlayableCountryRepository = new PlayableCountryRepository();
        const fileService: FileService = new FileService();
        const mapRepository: MapRepository = new MapRepository();

        const worldMap: Map | null = await mapRepository.firstOrFail({ name: 'World Map' });

        const playableCountries: {
            french: string;
            english: string;
            color: string;
            flagFileName: string;
            infantryAttackFactor: number;
            infantryDefenseFactor: number;
            infantryPriceFactor: number;
            shipAttackFactor: number;
            shipDefenseFactor: number;
            shipPriceFactor: number;
            landingAttackFactor: number;
            landingDefenseFactor: number;
            map: Map;
        }[] = [
            {
                french: 'États-Unis',
                english: 'United States',
                color: '#0dcfff',
                flagFileName: 'us.svg',
                infantryAttackFactor: 0.5,
                infantryDefenseFactor: 0.5,
                infantryPriceFactor: 0.4,
                shipAttackFactor: 0.5,
                shipDefenseFactor: 0.5,
                shipPriceFactor: 0.4,
                landingAttackFactor: 0.6,
                landingDefenseFactor: 0.5,
                map: worldMap,
            },
            {
                french: 'Royaume-Uni',
                english: 'United Kingdom',
                color: '#ff0d0d',
                flagFileName: 'uk.svg',
                infantryAttackFactor: 0.35,
                infantryDefenseFactor: 0.4,
                infantryPriceFactor: 0.45,
                shipAttackFactor: 0.6,
                shipDefenseFactor: 0.7,
                shipPriceFactor: 0.3,
                landingAttackFactor: 0.8,
                landingDefenseFactor: 0.55,
                map: worldMap,
            },
            {
                french: 'Empire Allemand',
                english: 'German Empire',
                color: '#818181',
                flagFileName: 'de.svg',
                infantryAttackFactor: 0.7,
                infantryDefenseFactor: 0.3,
                infantryPriceFactor: 0.35,
                shipAttackFactor: 0.35,
                shipDefenseFactor: 0.35,
                shipPriceFactor: 0.6,
                landingAttackFactor: 0.4,
                landingDefenseFactor: 0.3,
                map: worldMap,
            },
            {
                french: 'France',
                english: 'France',
                color: '#001fd6',
                flagFileName: 'fr.svg',
                infantryAttackFactor: 0.5,
                infantryDefenseFactor: 0.8,
                infantryPriceFactor: 0.3,
                shipAttackFactor: 0.5,
                shipDefenseFactor: 0.6,
                shipPriceFactor: 0.4,
                landingAttackFactor: 0.5,
                landingDefenseFactor: 0.6,
                map: worldMap,
            },
            {
                french: 'Russie',
                english: 'Russia',
                color: '#0a7510',
                flagFileName: 'ru.svg',
                infantryAttackFactor: 0.3,
                infantryDefenseFactor: 0.45,
                infantryPriceFactor: 0.15,
                shipAttackFactor: 0.25,
                shipDefenseFactor: 0.3,
                shipPriceFactor: 0.5,
                landingAttackFactor: 0.3,
                landingDefenseFactor: 0.4,
                map: worldMap,
            },
            {
                french: 'Japon',
                english: 'Japan',
                color: '#fdbb47',
                flagFileName: 'jp.svg',
                infantryAttackFactor: 0.6,
                infantryDefenseFactor: 0.5,
                infantryPriceFactor: 0.4,
                shipAttackFactor: 0.6,
                shipDefenseFactor: 0.5,
                shipPriceFactor: 0.35,
                landingAttackFactor: 0.6,
                landingDefenseFactor: 0.7,
                map: worldMap,
            },
        ];

        for (const country of playableCountries) {
            if (!(await playableCountryRepository.findOneBy({ englishName: country.english, mapId: country.map.id }))) {
                const path: string = `static/map/country-flag/${country.flagFileName}`;
                const { size, mimeType, extension, name } = await fileService.getFileInfo(app.makePath(path));
                const flag: File = await File.create({
                    name,
                    path,
                    extension,
                    mimeType,
                    size,
                });
                await flag.refresh();

                await PlayableCountry.create({
                    frenchName: country.french,
                    englishName: country.english,
                    color: country.color,
                    infantryAttackFactor: country.infantryAttackFactor,
                    infantryDefenseFactor: country.infantryDefenseFactor,
                    infantryPriceFactor: country.infantryPriceFactor,
                    shipAttackFactor: country.shipAttackFactor,
                    shipDefenseFactor: country.shipDefenseFactor,
                    shipPriceFactor: country.shipPriceFactor,
                    landingAttackFactor: country.landingAttackFactor,
                    landingDefenseFactor: country.landingDefenseFactor,
                    flagId: flag.id,
                    mapId: country.map.id,
                });
            }
        }
    }
}
