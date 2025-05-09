import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import RoomPlayer from '#models/room_player';
import SerializedPendingPeace from '#types/serialized/serialized_pending_peace';
import Language from '#models/language';

export default class PendingPeace extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare playerId: string;

    @belongsTo((): typeof RoomPlayer => RoomPlayer)
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

    public apiSerialize(language: Language): SerializedPendingPeace {
        return {
            id: this.frontId,
            enemy: this.enemy.apiSerialize(language),
            updatedAt: this.updatedAt?.toString(),
            createdAt: this.createdAt?.toString(),
        };
    }
}
