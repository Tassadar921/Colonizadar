import { DateTime } from 'luxon';
import {BaseModel, belongsTo, column, hasMany} from '@adonisjs/lucid/orm';
import Language from '#models/language';
import SerializedTerritory from '#types/serialized/serialized_territory';
import type {BelongsTo, HasMany} from '@adonisjs/lucid/types/relations';
import Map from '#models/map';
import PlayableCountry from '#models/playable_country';
import TerritoryNeighbour from "#models/territory_neighbour";

export default class Territory extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare code: string;

    @column()
    declare frenchName: string;

    @column()
    declare englishName: string;

    @column()
    declare isCoastal: boolean;

    @column()
    declare isFactory: boolean;

    @column()
    declare mapId: string;

    @belongsTo((): typeof Map => Map)
    declare map: BelongsTo<typeof Map>;

    @column()
    declare defaultBelongsToId: string;

    @belongsTo((): typeof PlayableCountry => PlayableCountry)
    declare defaultBelongsTo: BelongsTo<typeof PlayableCountry>;

    @hasMany((): typeof TerritoryNeighbour => TerritoryNeighbour, {
        foreignKey: 'territoryId',
    })
    declare neighbours: HasMany<typeof TerritoryNeighbour>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public translate(language: Language): string {
        switch (language.code) {
            case 'fr':
                return this.frenchName;
            case 'en':
                return this.englishName;
            default:
                return this.englishName;
        }
    }

    public apiSerialize(language: Language, isMain: boolean = true): SerializedTerritory {
        return {
            code: this.code,
            name: this.translate(language),
            isCoastal: this.isCoastal,
            isFactory: this.isFactory,
            neighbours: isMain ? this.neighbours.map((territoryNeighbour: TerritoryNeighbour): SerializedTerritory => territoryNeighbour.neighbour.apiSerialize(language, false)) : undefined,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
