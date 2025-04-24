import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import SerializedMap from '#types/serialized/serialized_map';
import Territory from '#models/territory';
import SerializedTerritory from '#types/serialized/serialized_territory';
import Language from '#models/language';
import File from '#models/file';
import SerializedMapLight from '#types/serialized/serialized_map_light';
import PlayableCountry from '#models/playable_country';

export default class Map extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare name: string;

    @column()
    declare neutralFlagId: string;

    @column()
    declare mainSeason: number;

    @belongsTo((): typeof File => File, {
        foreignKey: 'neutralFlagId',
    })
    declare neutralFlag: BelongsTo<typeof File>;

    @column()
    declare createdById: string;

    @belongsTo((): typeof User => User, {
        foreignKey: 'createdById',
    })
    declare createdBy: BelongsTo<typeof User>;

    @hasMany((): typeof Territory => Territory)
    declare territories: HasMany<typeof Territory>;

    @hasMany((): typeof PlayableCountry => PlayableCountry)
    declare playableCountries: HasMany<typeof PlayableCountry>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public async apiSerialize(language: Language): Promise<SerializedMap> {
        return {
            id: this.frontId,
            name: this.name,
            territories: await Promise.all(this.territories.map(async (territory: Territory): Promise<SerializedTerritory> => territory.apiSerialize(language, true))),
            createdBy: this.createdBy.apiSerialize(),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }

    public apiSerializeLight(): SerializedMapLight {
        return {
            id: this.frontId,
            name: this.name,
            createdBy: this.createdBy.apiSerialize(),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
