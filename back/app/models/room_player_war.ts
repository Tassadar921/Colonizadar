import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import RoomPlayer from '#models/room_player';

export default class RoomPlayerWar extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare playerId: string;

    @belongsTo((): typeof RoomPlayer => RoomPlayer, {
        foreignKey: 'playerId',
    })
    declare player: BelongsTo<typeof RoomPlayer>;

    @column()
    declare enemyId: string;

    @belongsTo((): typeof RoomPlayer => RoomPlayer, {
        foreignKey: 'enemyId',
    })
    declare enemy: BelongsTo<typeof RoomPlayer>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;
}
