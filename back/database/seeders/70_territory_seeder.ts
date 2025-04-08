import { BaseSeeder } from '@adonisjs/lucid/seeders';
import TerritoryRepository from '#repositories/territory_repository';
import Territory from '#models/territory';
import MapRepository from '#repositories/map_repository';
import Map from '#models/map';
import PlayableCountry from '#models/playable_country';
import PlayableCountryRepository from '#repositories/playable_country_repository';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const territoryRepository: TerritoryRepository = new TerritoryRepository();
        const mapRepository: MapRepository = new MapRepository();
        const playableCountryRepository: PlayableCountryRepository = new PlayableCountryRepository();

        const worldMap: Map | null = await mapRepository.findOneBy({ name: 'World Map' });
        if (!worldMap) {
            console.error('World map not found');
            return;
        }

        const worldMapPlayableCountries = await playableCountryRepository.getAllFromMapForSeeder(worldMap);
        if (!worldMapPlayableCountries) {
            console.error('World map playable countries not found');
            return;
        }

        const territories: { code: string; french: string; english: string; isCoastal: boolean; map: Map; defaultBelongsTo?: PlayableCountry; isFactory?: boolean; power?: number; ships?: number; }[] = [
            // ********** North America **********
            { code: 'AL', french: 'Alaska', english: 'Alaska', isCoastal: true, map: worldMap },
            { code: 'BC', french: 'Colombie-Britannique', english: 'British Columbia', isCoastal: true, map: worldMap },
            { code: 'NT', french: 'Territoires du Nord-Ouest', english: 'Northwest Territories', isCoastal: true, map: worldMap },
            { code: 'NU', french: 'Nunavut', english: 'Nunavut', isCoastal: true, map: worldMap },
            { code: 'NX', french: 'Ontario du nord', english: 'Northern Ontario', isCoastal: true, map: worldMap },
            { code: 'ON', french: 'Ontario du sud', english: 'Southern Ontario', isCoastal: false, map: worldMap },
            { code: 'QC', french: 'Québec', english: 'Quebec', isCoastal: true, map: worldMap },
            { code: 'FL', french: 'Floride', english: 'Florida', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.us, isFactory: true, power: 110, ships: 5 },
            { code: 'TX', french: 'Texas', english: 'Texas', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.us, isFactory: true, power: 25, ships: 55 },
            { code: 'CA', french: 'Californie', english: 'California', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.us, power: 65, ships: 15 },
            { code: 'DA', french: 'Dakota', english: 'Dakota', isCoastal: false, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.us, power: 55 },
            { code: 'MX', french: 'Mexique', english: 'Mexico', isCoastal: true, map: worldMap },
            { code: 'GL', french: 'Groenland', english: 'Greenland', isCoastal: true, map: worldMap },
            // ********** South America **********
            { code: 'GT', french: 'Guatemala', english: 'Guatemala', isCoastal: true, map: worldMap },
            { code: 'HN', french: 'Honduras', english: 'Honduras', isCoastal: true, map: worldMap },
            { code: 'NI', french: 'Nicaragua', english: 'Nicaragua', isCoastal: true, map: worldMap },
            { code: 'CR', french: 'Costa Rica', english: 'Costa Rica', isCoastal: true, map: worldMap },
            { code: 'PA', french: 'Panama', english: 'Panama', isCoastal: true, map: worldMap },
            { code: 'CO', french: 'Colombie', english: 'Colombia', isCoastal: true, map: worldMap },
            { code: 'VE', french: 'Vénézuéla', english: 'Venezuela', isCoastal: true, map: worldMap },
            { code: 'SR', french: 'Suriname', english: 'Suriname', isCoastal: true, map: worldMap },
            { code: 'EC', french: 'Équateur', english: 'Ecuador', isCoastal: true, map: worldMap },
            { code: 'PE', french: 'Pérou', english: 'Peru', isCoastal: true, map: worldMap },
            { code: 'CL', french: 'Chili', english: 'Chile', isCoastal: true, map: worldMap },
            { code: 'AR', french: 'Argentine', english: 'Argentina', isCoastal: true, map: worldMap },
            { code: 'UY', french: 'Uruguay', english: 'Uruguay', isCoastal: true, map: worldMap },
            { code: 'BR', french: 'Brésil', english: 'Brazil', isCoastal: true, map: worldMap },
            { code: 'PY', french: 'Paraguay', english: 'Paraguay', isCoastal: false, map: worldMap },
            { code: 'BO', french: 'Bolivie', english: 'Bolivia', isCoastal: false, map: worldMap },
            { code: 'FK', french: 'Falkland', english: 'Falkland', isCoastal: true, map: worldMap },
            // ********** Caribbean **********
            { code: 'CU', french: 'Cuba', english: 'Cuba', isCoastal: true, map: worldMap },
            { code: 'BS', french: 'Bahamas', english: 'Bahamas', isCoastal: true, map: worldMap },
            { code: 'HT', french: 'Haı̈ti', english: 'Haiti', isCoastal: true, map: worldMap },
            { code: 'JM', french: 'Jamaïque', english: 'Jamaica', isCoastal: true, map: worldMap },
            { code: 'PR', french: 'Porto Rico', english: 'Puerto Rico', isCoastal: true, map: worldMap },
            { code: 'TT', french: 'Trinité et Tobago', english: 'Trinidad and Tobago', isCoastal: true, map: worldMap },
            // ********** Europe **********
            { code: 'AC', french: 'Açores', english: 'Azores', isCoastal: true, map: worldMap },
            { code: 'IS', french: 'Islande', english: 'Iceland', isCoastal: true, map: worldMap },
            { code: 'SN', french: 'Écosse', english: 'Scotland', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.gb, isFactory: true, power: 60, ships: 85 },
            { code: 'IL', french: 'Irlande', english: 'Ireland', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.gb, isFactory: true, power: 120, ships: 30 },
            { code: 'GB', french: 'Grande-Bretagne', english: 'Great Britain', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.gb, power: 45, ships: 10 },
            { code: 'NF', french: 'Nord de la France', english: 'Northern France', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.fr, power: 110, ships: 15 },
            { code: 'MF', french: 'France centrale', english: 'Middle France', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.fr, isFactory: true, power: 110, ships: 55 },
            { code: 'SF', french: 'Sud de la France', english: 'Southern France', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.fr, isFactory: true, power: 75, ships: 25 },
            { code: 'ES', french: 'Espagne', english: 'Spain', isCoastal: true, map: worldMap },
            { code: 'PT', french: 'Portugal', english: 'Portugal', isCoastal: true, map: worldMap },
            { code: 'BA', french: 'Baléares', english: 'Balearic', isCoastal: true, map: worldMap },
            { code: 'SG', french: 'Sardaigne', english: 'Sardinia', isCoastal: true, map: worldMap },
            { code: 'IT', french: 'Italie', english: 'Italia', isCoastal: true, map: worldMap },
            { code: 'SL', french: 'Sicile', english: 'Sicily', isCoastal: true, map: worldMap },
            { code: 'NL', french: 'Pays-Bas', english: 'Netherlands', isCoastal: true, map: worldMap },
            { code: 'RH', french: 'Rhénanie', english: 'Rhine', isCoastal: false, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.de, isFactory: true, power: 110 },
            { code: 'SX', french: 'Saxe', english: 'Saxony', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.de, isFactory: true, power: 120, ships: 10 },
            { code: 'PS', french: 'Prusse', english: 'Prussia', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.de, power: 65, ships: 5 },
            { code: 'AT', french: 'Autriche', english: 'Austria', isCoastal: true, map: worldMap },
            { code: 'RO', french: 'Roumanie', english: 'Romania', isCoastal: true, map: worldMap },
            { code: 'BG', french: 'Bulgarie', english: 'Bulgaria', isCoastal: true, map: worldMap },
            { code: 'GR', french: 'Grèce', english: 'Greece', isCoastal: true, map: worldMap },
            { code: 'DK', french: 'Danemark', english: 'Denmark', isCoastal: true, map: worldMap },
            { code: 'NO', french: 'Norvège', english: 'Norway', isCoastal: true, map: worldMap },
            { code: 'SE', french: 'Suède', english: 'Sweden', isCoastal: true, map: worldMap },
            { code: 'FI', french: 'Finlande', english: 'Finland', isCoastal: true, map: worldMap },
            { code: 'UR', french: 'Oural', english: 'Ural', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.ru, power: 170, ships: 15 },
            // ********** Africa **********
            { code: 'CN', french: 'Canaries', english: 'Canaries', isCoastal: true, map: worldMap },
            { code: 'CV', french: 'Cap Vert', english: 'Cape Verde', isCoastal: true, map: worldMap },
            { code: 'ST', french: 'Sao Tomé et Principe', english: 'Sao Tome and Principe', isCoastal: true, map: worldMap },
            { code: 'MA', french: 'Maroc', english: 'Morocco', isCoastal: true, map: worldMap },
            { code: 'DZ', french: 'Algérie', english: 'Algeria', isCoastal: true, map: worldMap },
            { code: 'TN', french: 'Tunisie', english: 'Tunisia', isCoastal: true, map: worldMap },
            { code: 'LY', french: 'Libye', english: 'Libya', isCoastal: true, map: worldMap },
            { code: 'EG', french: 'Égypte', english: 'Egypt', isCoastal: true, map: worldMap },
            { code: 'MR', french: 'Mauritanie', english: 'Mauritania', isCoastal: true, map: worldMap },
            { code: 'GN', french: 'Guinée', english: 'Guinea', isCoastal: true, map: worldMap },
            { code: 'ML', french: 'Mali', english: 'Mali', isCoastal: false, map: worldMap },
            { code: 'CI', french: 'Côte d’Ivoire', english: 'Côte d’Ivoire', isCoastal: true, map: worldMap },
            { code: 'NG', french: 'Nigeria', english: 'Nigeria', isCoastal: true, map: worldMap },
            { code: 'NE', french: 'Niger', english: 'Niger', isCoastal: false, map: worldMap },
            { code: 'TD', french: 'Tchad', english: 'Chad', isCoastal: false, map: worldMap },
            { code: 'SD', french: 'Soudan', english: 'Sudan', isCoastal: true, map: worldMap },
            { code: 'CM', french: 'Cameroun', english: 'Cameroon', isCoastal: true, map: worldMap },
            { code: 'ET', french: 'Éthiopie', english: 'Ethiopia', isCoastal: false, map: worldMap },
            { code: 'SO', french: 'Somalie', english: 'Somalia', isCoastal: true, map: worldMap },
            { code: 'KE', french: 'Kenya', english: 'Kenya', isCoastal: true, map: worldMap },
            { code: 'CD', french: 'Congo', english: 'Congo', isCoastal: true, map: worldMap },
            { code: 'TZ', french: 'Tanzanie', english: 'Tanzania', isCoastal: true, map: worldMap },
            { code: 'MZ', french: 'Mozambique', english: 'Mozambique', isCoastal: true, map: worldMap },
            { code: 'AO', french: 'Angola', english: 'Angola', isCoastal: true, map: worldMap },
            { code: 'NA', french: 'Namibie', english: 'Namibia', isCoastal: true, map: worldMap },
            { code: 'ZM', french: 'Zambie', english: 'Zambia', isCoastal: false, map: worldMap },
            { code: 'BW', french: 'Botswana', english: 'Botswana', isCoastal: false, map: worldMap },
            { code: 'ZA', french: 'Afrique du Sud', english: 'South Africa', isCoastal: true, map: worldMap },
            { code: 'MG', french: 'Madagascar', english: 'Madagascar', isCoastal: true, map: worldMap },
            { code: 'MU', french: 'Maurice', english: 'Mauritius', isCoastal: true, map: worldMap },
            { code: 'KM', french: 'Comores', english: 'Comoros', isCoastal: true, map: worldMap },
            { code: 'SC', french: 'Seychelles', english: 'Seychelles', isCoastal: true, map: worldMap },
            { code: 'DR', french: 'Socotra', english: 'Socotra', isCoastal: true, map: worldMap },
            // ********** Middle East **********
            { code: 'TR', french: 'Turquie', english: 'Turkey', isCoastal: true, map: worldMap },
            { code: 'CY', french: 'Chypre', english: 'Cyprus', isCoastal: true, map: worldMap },
            { code: 'IQ', french: 'Iraq', english: 'Iraq', isCoastal: true, map: worldMap },
            { code: 'SY', french: 'Syrie', english: 'Syria', isCoastal: true, map: worldMap },
            { code: 'JO', french: 'Jordanie', english: 'Jordan', isCoastal: true, map: worldMap },
            { code: 'SA', french: 'Arabie saoudite', english: 'Saudi Arabia', isCoastal: true, map: worldMap },
            { code: 'YE', french: 'Yemen', english: 'Yemen', isCoastal: true, map: worldMap },
            { code: 'OM', french: 'Oman', english: 'Oman', isCoastal: true, map: worldMap },
            // ********** Asia **********
            { code: 'SW', french: 'Sibérie occidentale', english: 'Western Siberia', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.ru, isFactory: true, power: 150, ships: 25 },
            { code: 'CS', french: 'Sibérie centrale', english: 'Central Siberia', isCoastal: false, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.ru, power: 70 },
            { code: 'SI', french: 'Sibérie orientale', english: 'Eastern Siberia', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.ru, power: 75, ships: 35 },
            { code: 'IR', french: 'Perse', english: 'Persia', isCoastal: true, map: worldMap },
            { code: 'AF', french: 'Afghanistan', english: 'Afghanistan', isCoastal: false, map: worldMap },
            { code: 'WP', french: 'Pakistan occidental', english: 'Western Pakistan', isCoastal: true, map: worldMap },
            { code: 'EP', french: 'Pakistan oriental', english: 'Eastern Pakistan', isCoastal: true, map: worldMap },
            { code: 'NK', french: 'Nord du Pakistan', english: 'Northern Pakistan', isCoastal: false, map: worldMap },
            { code: 'NP', french: 'Népal', english: 'Nepal', isCoastal: false, map: worldMap },
            { code: 'UP', french: 'Uttar Pradesh', english: 'Uttar Pradesh', isCoastal: false, map: worldMap },
            { code: 'WI', french: 'Inde occidentale', english: 'Western India', isCoastal: true, map: worldMap },
            { code: 'MI', french: 'Inde centrale', english: 'Central India', isCoastal: true, map: worldMap },
            { code: 'EI', french: 'Inde orientale', english: 'Eastern India', isCoastal: true, map: worldMap },
            { code: 'LK', french: 'Sri Lanka', english: 'Sri Lanka', isCoastal: true, map: worldMap },
            { code: 'MV', french: 'Maldives', english: 'Maldives', isCoastal: true, map: worldMap },
            { code: 'BD', french: 'Bangladesh', english: 'Bangladesh', isCoastal: true, map: worldMap },
            { code: 'BT', french: 'Bhoutan', english: 'Bhutan', isCoastal: false, map: worldMap },
            { code: 'MM', french: 'Myanmar', english: 'Myanmar', isCoastal: true, map: worldMap },
            { code: 'MY', french: 'Malaisie', english: 'Malaysia', isCoastal: true, map: worldMap },
            { code: 'TH', french: 'Thailand', english: 'Thailand', isCoastal: true, map: worldMap },
            { code: 'KH', french: 'Cambodge', english: 'Cambodia', isCoastal: true, map: worldMap },
            { code: 'VN', french: 'Vietnam', english: 'Vietnam', isCoastal: true, map: worldMap },
            { code: 'MC', french: 'Mandchourie', english: 'Manchuria', isCoastal: true, map: worldMap },
            { code: 'KO', french: 'Corée', english: 'Korea', isCoastal: true, map: worldMap },
            { code: 'MN', french: 'Mongolie', english: 'Mongolia', isCoastal: false, map: worldMap },
            { code: 'TB', french: 'Tibet', english: 'Tibet', isCoastal: false, map: worldMap },
            { code: 'SH', french: 'Shaanxi', english: 'Shaanxi', isCoastal: false, map: worldMap },
            { code: 'YN', french: 'Yunnan', english: 'Yunnan', isCoastal: true, map: worldMap },
            { code: 'SZ', french: 'Shandong', english: 'Shandong', isCoastal: true, map: worldMap },
            { code: 'ZH', french: 'Zhili', english: 'Zhili', isCoastal: true, map: worldMap },
            { code: 'TW', french: 'Taiwan', english: 'Taiwan', isCoastal: true, map: worldMap },
            { code: 'KI', french: 'Îles Komandorski', english: 'Komandorski Islands', isCoastal: true, map: worldMap },
            { code: 'HK', french: 'Hokkaido', english: 'Hokkaido', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.jp, power: 130, ships: 5 },
            { code: 'HS', french: 'Honshu', english: 'Honshu', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.jp, isFactory: true, power: 100, ships: 50 },
            { code: 'KU', french: 'Kyushu', english: 'Kyushu', isCoastal: true, map: worldMap, defaultBelongsTo: worldMapPlayableCountries.jp, isFactory: true, power: 70, ships: 40 },
            // ********** Oceania **********
            { code: 'PH', french: 'Philippines', english: 'Philippines', isCoastal: true, map: worldMap },
            { code: 'SM', french: 'Sumatra', english: 'Sumatra', isCoastal: true, map: worldMap },
            { code: 'JV', french: 'Java', english: 'Java', isCoastal: true, map: worldMap },
            { code: 'BE', french: 'Bornéo', english: 'Borneo', isCoastal: true, map: worldMap },
            { code: 'SS', french: 'Sulawesi', english: 'Sulawesi', isCoastal: true, map: worldMap },
            { code: 'PG', french: 'Papouasie', english: 'Papua', isCoastal: true, map: worldMap },
            { code: 'SB', french: 'Îles Salomon', english: 'Solomon Islands', isCoastal: true, map: worldMap },
            { code: 'VU', french: 'Vanuatu', english: 'Vanuatu', isCoastal: true, map: worldMap },
            { code: 'NZ', french: 'Nouvelle-Zélande', english: 'New Zealand', isCoastal: true, map: worldMap },
            { code: 'WA', french: 'Australie Occidentale', english: 'Western Australia', isCoastal: true, map: worldMap },
            { code: 'AN', french: 'Territoire du nord', english: 'Northern Territory', isCoastal: true, map: worldMap },
            { code: 'QL', french: 'Queensland', english: 'Queensland', isCoastal: true, map: worldMap },
            { code: 'NS', french: 'Nouvelle Galle du Sud', english: 'New South Wales', isCoastal: true, map: worldMap },
        ];

        for (const territory of territories) {
            if (!(await territoryRepository.findOneBy({ code: territory.code, mapId: territory.map.id }))) {
                await Territory.create({
                    frenchName: territory.french,
                    englishName: territory.english,
                    code: territory.code,
                    isCoastal: territory.isCoastal,
                    isFactory: territory.isFactory,
                    defaultPower: territory.power,
                    defaultShips: territory.isCoastal ? 0 : territory.ships,
                    mapId: territory.map.id,
                    defaultBelongsToId: territory.defaultBelongsTo?.id,
                });
                console.log(`Territory ${territory.code} created for map ${territory.map.name}`);
            } else {
                console.log(`Territory ${territory.code} already exists for map ${territory.map.name}`);
            }
        }
    }
}
