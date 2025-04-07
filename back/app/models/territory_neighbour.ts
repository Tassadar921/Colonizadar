import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Map from '#models/map';
import Territory from "#models/territory";

export default class TerritoryNeighbour extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare territoryId: string;

    @belongsTo((): typeof Territory => Territory)
    declare territory: BelongsTo<typeof Territory>;

    @column()
    declare neighbourId: string;

    @belongsTo((): typeof Territory => Territory, {
        foreignKey: 'neighbourId',
    })
    declare neighbour: BelongsTo<typeof Territory>;

    @column()
    declare mapId: string;

    @belongsTo((): typeof Map => Map)
    declare map: BelongsTo<typeof Map>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;
}
