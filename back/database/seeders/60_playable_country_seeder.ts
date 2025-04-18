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
            infantryAttack: number;
            infantryDefense: number;
            infantryPrice: number;
            shipAttack: number;
            shipDefense: number;
            shipPrice: number;
            landingAttack: number;
            landingDefense: number;
            map: Map;
        }[] = [
            {
                french: 'États-Unis',
                english: 'United States',
                color: '#0dcfff',
                flagFileName: 'us.svg',
                infantryAttack: 50,
                infantryDefense: 50,
                infantryPrice: 40,
                shipAttack: 50,
                shipDefense: 50,
                shipPrice: 40,
                landingAttack: 60,
                landingDefense: 50,
                map: worldMap,
            },
            {
                french: 'Royaume-Uni',
                english: 'United Kingdom',
                color: '#ff0d0d',
                flagFileName: 'uk.svg',
                infantryAttack: 35,
                infantryDefense: 40,
                infantryPrice: 45,
                shipAttack: 60,
                shipDefense: 70,
                shipPrice: 30,
                landingAttack: 80,
                landingDefense: 55,
                map: worldMap,
            },
            {
                french: 'Empire Allemand',
                english: 'German Empire',
                color: '#818181',
                flagFileName: 'de.svg',
                infantryAttack: 70,
                infantryDefense: 30,
                infantryPrice: 35,
                shipAttack: 35,
                shipDefense: 35,
                shipPrice: 60,
                landingAttack: 40,
                landingDefense: 30,
                map: worldMap,
            },
            {
                french: 'France',
                english: 'France',
                color: '#001fd6',
                flagFileName: 'fr.svg',
                infantryAttack: 50,
                infantryDefense: 80,
                infantryPrice: 30,
                shipAttack: 50,
                shipDefense: 60,
                shipPrice: 40,
                landingAttack: 50,
                landingDefense: 60,
                map: worldMap,
            },
            {
                french: 'Russie',
                english: 'Russia',
                color: '#0a7510',
                flagFileName: 'ru.svg',
                infantryAttack: 30,
                infantryDefense: 45,
                infantryPrice: 15,
                shipAttack: 25,
                shipDefense: 30,
                shipPrice: 50,
                landingAttack: 30,
                landingDefense: 40,
                map: worldMap,
            },
            {
                french: 'Japon',
                english: 'Japan',
                color: '#fdbb47',
                flagFileName: 'jp.svg',
                infantryAttack: 60,
                infantryDefense: 50,
                infantryPrice: 40,
                shipAttack: 60,
                shipDefense: 50,
                shipPrice: 35,
                landingAttack: 60,
                landingDefense: 70,
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
                    infantryAttack: country.infantryAttack,
                    infantryDefense: country.infantryDefense,
                    infantryPrice: country.infantryPrice,
                    shipAttack: country.shipAttack,
                    shipDefense: country.shipDefense,
                    shipPrice: country.shipPrice,
                    landingAttack: country.landingAttack,
                    landingDefense: country.landingDefense,
                    flagId: flag.id,
                    mapId: country.map.id,
                });
                console.log(`Playable country ${country.english} created`);
            }
        }
    }
}
