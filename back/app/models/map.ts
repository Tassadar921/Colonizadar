import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import SerializedMap from '#types/serialized/serialized_map';
import Territory from '#models/territory';
import SerializedTerritory from '#types/serialized/serialized_territory';
import Language from '#models/language';

export default class Map extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare name: string;

    @column()
    declare createdById: string;

    @belongsTo((): typeof User => User, {
        foreignKey: 'createdById',
    })
    declare createdBy: BelongsTo<typeof User>;

    @hasMany((): typeof Territory => Territory)
    declare territories: HasMany<typeof Territory>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public async apiSerialize(language: Language): Promise<SerializedMap> {
        return {
            id: this.frontId,
            name: this.name,
            territories: await Promise.all(this.territories.map(async (territory: Territory): Promise<SerializedTerritory> => territory.apiSerialize(language))),
            createdBy: this.createdBy.apiSerialize(),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
